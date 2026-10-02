<?php
$dest = __DIR__ . '/assets/images';
if (!is_dir($dest)) {
    mkdir($dest, 0777, true);
}

$sourceDir = 'C:/Users/batam/.gemini/antigravity-ide/brain/5c8b0b1a-f7d1-4b98-889e-895713a8db9e';
$mappings = [
    'necklace.jpg' => 'necklace_pearl_senja_',
    'ring.jpg' => 'ring_songket_melaka_',
    'bowl.jpg' => 'decor_shell_bowl_',
    'earrings.jpg' => 'brooch_earrings_bahari_',
    'bracelet.jpg' => 'bracelet_selat_malaka_',
    'brooch.jpg' => 'brooch_kerang_gonggong_',
    'artisan.jpg' => 'artisan_crafting_shell_',
    'hero_shell_3d.jpg' => 'hero_3d_shell_artifact_',
];

$files = scandir($sourceDir);
foreach ($mappings as $destName => $prefix) {
    foreach ($files as $file) {
        if (str_starts_with($file, $prefix) && str_ends_with($file, '.jpg')) {
            copy("$sourceDir/$file", "$dest/$destName");
            echo "Copied $file -> $destName\n";
            break;
        }
    }
}
echo "Finished asset copy.\n";
