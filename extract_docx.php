<?php
$zip = new ZipArchive();
$filePath = __DIR__ . '/SELARAS KRIYA.docx';
if ($zip->open($filePath) === TRUE) {
    $xml = $zip->getFromName('word/document.xml');
    $zip->close();
    // Replace paragraph endings with newlines
    $xml = preg_replace('/<\/w:p>/', "\n", $xml);
    $text = strip_tags($xml);
    $lines = explode("\n", $text);
    $out = [];
    foreach ($lines as $line) {
        $t = trim(html_entity_decode($line, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        if (strlen($t) > 0) {
            $out[] = $t;
        }
    }
    $outPath = 'C:/Users/batam/.gemini/antigravity-ide/brain/5c8b0b1a-f7d1-4b98-889e-895713a8db9e/scratch/proposal.txt';
    @mkdir(dirname($outPath), 0777, true);
    file_put_contents($outPath, implode("\n", $out));
    echo "Extracted " . count($out) . " lines to $outPath\n";
} else {
    echo "Failed to open docx\n";
}
