const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_USER_DATA = path.join(os.tmpdir(), 'edge_cdp_test_' + Date.now());
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\7e678ab4-9e67-415b-9fc8-b11cfb3c6004';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching headless Edge...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    `--user-data-dir=${TEMP_USER_DATA}`,
    'http://localhost:8089/index.html'
  ]);

  let isKilled = false;
  const cleanup = () => {
    if (!isKilled) {
      isKilled = true;
      try { edgeProc.kill(); } catch (e) {}
      try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch (e) {}
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      try {
        const res = await fetch('http://localhost:9222/json');
        const list = await res.json();
        const page = list.find(item => item.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) {
      throw new Error('Failed to obtain CDP WebSocket URL from Edge');
    }

    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const { resolve, reject } = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result?.value;
    }

    async function takeScreenshot(name) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(ARTIFACT_DIR, name);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log('Saved screenshot:', filePath);
      return filePath;
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Desktop Viewport
    console.log('Testing Desktop 1280x800...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(800);
    await takeScreenshot('verified_desktop_hero.png');

    // 2. Open 3D Artifact Modal
    console.log('Opening 3D Artifact modal...');
    await evaluate(`open3DArtifactModal()`);
    await sleep(2000); // Allow Three.js to render
    await takeScreenshot('verified_3d_modal_gold.png');

    // 3. Switch 3D Material to Wireframe
    console.log('Switching 3D Material to wireframe...');
    await evaluate(`switch3DMaterial('wireframe')`);
    await sleep(800);
    await takeScreenshot('verified_3d_modal_wireframe.png');

    // 4. Close 3D Modal & Open Checkout Modal
    console.log('Opening Checkout Modal on desktop...');
    await evaluate(`closeProductModal()`);
    await sleep(400);
    await evaluate(`openCheckoutModal()`);
    await sleep(800);
    await takeScreenshot('verified_checkout_desktop.png');

    // 5. Test QRIS Tab in Checkout
    console.log('Testing QRIS Tab in Checkout...');
    await evaluate(`
      const chip = document.querySelector('.payment-tabs .chip[data-method="qris"]');
      if (chip) chip.click();
    `);
    await sleep(600);
    await takeScreenshot('verified_checkout_qris.png');

    // 6. Test Mobile Viewport (390x844)
    console.log('Testing Mobile 390x844...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(800);
    // Switch back to Card view
    await evaluate(`
      const cardChip = document.querySelector('.payment-tabs .chip[data-method="card"]');
      if (cardChip) cardChip.click();
    `);
    await sleep(600);
    await takeScreenshot('verified_checkout_mobile.png');

    // 7. Close Checkout Modal on Mobile & Capture Mobile Hero
    console.log('Testing Mobile Hero...');
    await evaluate(`closeCheckoutModal()`);
    await sleep(600);
    await takeScreenshot('verified_hero_mobile.png');

    // 8. Capture Mobile Catalog
    console.log('Testing Mobile Catalog...');
    await evaluate(`document.getElementById('katalog').scrollIntoView()`);
    await sleep(600);
    await takeScreenshot('verified_catalog_mobile.png');

    console.log('All tests completed successfully!');
    ws.close();
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    cleanup();
  }
}

run();
