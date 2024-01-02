import fs from "fs";
import https from "https"; // or 'https' for https:// URLs
import * as Scry from "scryfall-sdk";

const iconTypes = [
  { rarity: "common", color: "black", theme: "light" },
  { rarity: "common", color: "white", theme: "dark" },
  { rarity: "uncommon", color: "silver" },
  { rarity: "rare", color: "gold" },
  { rarity: "mythic", color: "orange" },
];

async function getAllMtgSets() {
  const sets = await Scry.Sets.all();
  return sets;
  // .filter((set) =>
  //   ["core", "expansion", "masters", "draft_innovation"].includes(
  //     set.set_type,
  //   ),
  // )
  // .filter((set) => set.digital === false);
  // filter all sets released after 2015 based on release date
  // .filter((set) => {
  //   const releaseDate = new Date(set.released_at!);
  //   return releaseDate.getFullYear() >= 2018;
  // })
}

function download(url: string, setCode: string) {
  const dirPath = `./public/assets/${setCode}`;
  if (fs.existsSync(dirPath)) {
    console.log(`${setCode} already exists`);
    return;
  }
  fs.mkdirSync(dirPath);
  const filename = `${setCode}.svg`;
  const file = fs.createWriteStream(`${dirPath}/${filename}`);
  https.get(url, function (response) {
    console.log(`Downloading ${setCode}...`);
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      fs.readFile(`${dirPath}/${filename}`, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let split: string[] = data.split(" ");
        // check if split contains fill=
        if (!split.some((element) => element.startsWith("fill="))) {
          // if not, add fill="#000" after every element that ends with <path
          split = split.map((element) => {
            if (element.endsWith("<path")) {
              return `${element} fill="#000"`;
            } else {
              return element;
            }
          });
        }
        split = split.join(" ").split(" ");
        iconTypes.forEach((iconType) => {
          const newData = split
            .map((element) => {
              if (element.startsWith("fill=")) {
                return `fill="${iconType.color}"`;
              } else {
                return element;
              }
            })
            .join(" ");
          const newFilename = iconType.theme
            ? `${setCode}-${iconType.rarity}-${iconType.theme}.svg`
            : `${setCode}-${iconType.rarity}.svg`;
          fs.writeFile(`${dirPath}/${newFilename}`, newData, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
      });
      console.log(`Download of ${setCode} completed`);
    });
  });
}

async function runScript() {
  console.log("Getting all sets...");
  const sets = await getAllMtgSets();
  console.log("Downloading set icons...");
  sets.forEach((set) => {
    download(set.icon_svg_uri, set.code);
  });
  console.log("Done");
}

runScript().then(() => {});
