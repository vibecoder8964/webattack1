#!/bin/bash
# Download placeholder product images using picsum.photos
IMAGES_DIR="/home/z/my-project/ctf-data/var/www/images"
cd "$IMAGES_DIR"

# Define product images to download (using picsum.photos with specific IDs for variety)
declare -A IMAGES=(
  ["headphones.jpg"]="1043"
  ["coffee.jpg"]="1060"
  ["shoes.jpg"]="1040"
  ["watch.jpg"]="1003"
  ["yogamat.jpg"]="1076"
  ["speaker.jpg"]="1080"
  ["wallet.jpg"]="1005"
  ["protein.jpg"]="1074"
  ["lamp.jpg"]="1067"
  ["bottle.jpg"]="1062"
  ["keyboard.jpg"]="1069"
  ["mugs.jpg"]="1073"
  ["tracker.jpg"]="1075"
  ["candles.jpg"]="1078"
  ["boardgame.jpg"]="1039"
  ["gardenkit.jpg"]="1082"
  ["phonemount.jpg"]="1035"
  ["cookbook.jpg"]="1076"
  ["gamingmouse.jpg"]="1044"
  ["moisturizer.jpg"]="1065"
  ["earbuds.jpg"]="1061"
  ["skillet.jpg"]="1042"
  ["trailshoes.jpg"]="1040"
  ["vitcserum.jpg"]="1065"
  ["scifibooks.jpg"]="1076"
  ["gamingheadset.jpg"]="1043"
  ["bands.jpg"]="1076"
  ["growlight.jpg"]="1067"
  ["dashcam.jpg"]="1074"
  ["sunglasses.jpg"]="1005"
  ["matcha.jpg"]="1060"
  ["drone.jpg"]="1075"
  ["lipbalm.jpg"]="1065"
  ["quantum.jpg"]="1003"
  ["neural.jpg"]="1003"
  ["laptop.jpg"]="1008"
  ["tablet.jpg"]="1045"
  ["backpack.jpg"]="1046"
  ["tshirt.jpg"]="1040"
  ["hoodie.jpg"]="1040"
  ["jacket.jpg"]="1040"
  ["socks.jpg"]="1040"
  ["hat.jpg"]="1040"
  ["ring.jpg"]="1005"
  ["necklace.jpg"]="1005"
  ["bracelet.jpg"]="1005"
  ["teaset.jpg"]="1073"
  ["coffeemaker.jpg"]="1060"
  ["blender.jpg"]="1042"
  ["airfryer.jpg"]="1042"
  ["vacuum.jpg"]="1080"
  ["flashlight.jpg"]="1067"
  ["multitool.jpg"]="1082"
  ["hammock.jpg"]="1076"
  ["sleepingbag.jpg"]="1076"
  ["tent.jpg"]="1076"
  ["binoculars.jpg"]="1075"
  ["sunglasses2.jpg"]="1005"
  ["watch2.jpg"]="1003"
  ["earrings.jpg"]="1005"
  ["perfume.jpg"]="1065"
  ["hairdryer.jpg"]="1080"
  ["shaver.jpg"]="1080"
  ["nailkit.jpg"]="1065"
  ["boardgame2.jpg"]="1039"
  ["puzzle.jpg"]="1039"
  ["lego.jpg"]="1039"
  ["controller.jpg"]="1044"
  ["mousepad.jpg"]="1044"
  ["monitor.jpg"]="1008"
  ["webcam.jpg"]="1075"
  ["microphone.jpg"]="1043"
  ["usbcable.jpg"]="1080"
  ["powerbank.jpg"]="1080"
  ["charger.jpg"]="1080"
  ["battery.jpg"]="1080"
)

for name in "${!IMAGES[@]}"; do
  if [ ! -f "$name" ]; then
    id="${IMAGES[$name]}"
    echo "Downloading $name..."
    curl -sL "https://picsum.photos/id/${id}/400/400" -o "$name" 2>/dev/null
    # Check if download was successful and has reasonable size
    if [ -f "$name" ]; then
      size=$(stat -c%s "$name" 2>/dev/null || echo 0)
      if [ "$size" -lt 1000 ]; then
        echo "  Warning: $name seems too small ($size bytes), retrying with different ID..."
        curl -sL "https://picsum.photos/400/400?random=${RANDOM}" -o "$name" 2>/dev/null
      fi
    fi
  fi
done

echo "Done downloading images!"
ls -la *.jpg 2>/dev/null | wc -l
