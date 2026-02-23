import { useState, useMemo } from "react";

// dim = slab dimensions in inches. Natural stone defaults ~115x69 (varies by lot).
const AZ_TILE = [
  // ─── GRANITE ───
  {n:"Atacama",c:"Granite",p:21.14,sf:55.0,dim:"~115x69"},{n:"Atlantico",c:"Granite",p:10.29,sf:55.0,dim:"~115x69"},{n:"Avocatus Satin",c:"Granite",p:55.04,sf:55.0,dim:"~115x69"},{n:"Barcelona",c:"Granite",p:10.04,sf:55.0,dim:"~115x69"},{n:"Belvedere Satin",c:"Granite",p:50.16,sf:55.0,dim:"~115x69"},{n:"Bianco Typhoon Satin",c:"Granite",p:15.95,sf:55.0,dim:"~115x69"},{n:"Bianco Typhoon",c:"Granite",p:15.95,sf:55.0,dim:"~115x69"},{n:"Black Mist Honed",c:"Granite",p:17.75,sf:55.0,dim:"~115x69"},{n:"Black Pearl Satin",c:"Granite",p:17.53,sf:55.0,dim:"~115x69"},{n:"Black Pearl",c:"Granite",p:17.59,sf:55.0,dim:"~115x69"},{n:"Bliss",c:"Granite",p:11.44,sf:55.0,dim:"~115x69"},{n:"Blizzard",c:"Granite",p:18.58,sf:55.0,dim:"~115x69"},{n:"Bluzonite",c:"Granite",p:27.72,sf:55.0,dim:"~115x69"},{n:"Carbon Grey Satin",c:"Granite",p:38.39,sf:55.0,dim:"~115x69"},{n:"Colonial White",c:"Granite",p:21.59,sf:55.0,dim:"~115x69"},{n:"Dallas White",c:"Granite",p:11.36,sf:55.0,dim:"~115x69"},{n:"Delicatus White",c:"Granite",p:26.61,sf:55.0,dim:"~115x69"},{n:"Desert Canyon",c:"Granite",p:51.65,sf:55.0,dim:"~115x69"},{n:"Indian Premium Black Honed",c:"Granite",p:33.70,sf:55.0,dim:"~115x69"},{n:"Indian Premium Black Satin",c:"Granite",p:33.70,sf:55.0,dim:"~115x69"},{n:"Indian Premium Black",c:"Granite",p:33.70,sf:55.0,dim:"~115x69"},{n:"Kalahari",c:"Granite",p:20.37,sf:55.0,dim:"~115x69"},{n:"Kashmire Cream",c:"Granite",p:26.40,sf:55.0,dim:"~115x69"},{n:"Monte Cristo Satin",c:"Granite",p:24.09,sf:55.0,dim:"~115x69"},{n:"Monte Cristo",c:"Granite",p:24.11,sf:55.0,dim:"~115x69"},{n:"Negresco Satin",c:"Granite",p:37.61,sf:55.0,dim:"~115x69"},{n:"New Caledonia",c:"Granite",p:11.38,sf:55.0,dim:"~115x69"},{n:"New Romano Satin",c:"Granite",p:18.31,sf:55.0,dim:"~115x69"},{n:"New Romano",c:"Granite",p:18.31,sf:55.0,dim:"~115x69"},{n:"New Valle Nevado",c:"Granite",p:11.36,sf:55.0,dim:"~115x69"},{n:"Silver Cloud Satin",c:"Granite",p:16.89,sf:55.0,dim:"~115x69"},{n:"Silver Falls",c:"Granite",p:15.90,sf:55.0,dim:"~115x69"},{n:"Snowridge",c:"Granite",p:15.36,sf:55.0,dim:"~115x69"},{n:"St Cecilia Light",c:"Granite",p:12.02,sf:55.0,dim:"~115x69"},{n:"St Cecilia White",c:"Granite",p:11.03,sf:55.0,dim:"~115x69"},{n:"Steel Grey Satin",c:"Granite",p:17.54,sf:55.0,dim:"~115x69"},{n:"Steel Grey",c:"Granite",p:17.62,sf:55.0,dim:"~115x69"},{n:"Titanium",c:"Granite",p:28.88,sf:55.0,dim:"~115x69"},{n:"Typhoon Bordeaux",c:"Granite",p:38.39,sf:55.0,dim:"~115x69"},{n:"Verde Ubatuba",c:"Granite",p:11.80,sf:55.0,dim:"~115x69"},{n:"Viridian",c:"Granite",p:57.91,sf:55.0,dim:"~115x69"},{n:"Viscount White",c:"Granite",p:16.63,sf:55.0,dim:"~115x69"},{n:"Volcano",c:"Granite",p:37.16,sf:55.0,dim:"~115x69"},{n:"Whisper White",c:"Granite",p:20.34,sf:55.0,dim:"~115x69"},
  // ─── MARBLE & DOLOMITE ───
  {n:"Bianco Carrara Honed",c:"Marble",p:26.65,sf:55.0,dim:"~115x69"},{n:"Bianco Carrara",c:"Marble",p:26.65,sf:55.0,dim:"~115x69"},{n:"Calacatta Umber Honed",c:"Marble",p:51.03,sf:55.0,dim:"~115x69"},{n:"Fantasy Black Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Blue Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Brown Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Brown",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Ocean Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Statuary Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Fantasy Zebra Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69"},{n:"Opal White Satin",c:"Marble",p:31.64,sf:55.0,dim:"~115x69"},{n:"Opal White",c:"Marble",p:31.64,sf:55.0,dim:"~115x69"},
  // ─── QUARTZITE ───
  {n:"Aqua Venato",c:"Quartzite",p:40.95,sf:55.0,dim:"~115x69"},{n:"Artemis",c:"Quartzite",p:46.90,sf:55.0,dim:"~115x69"},{n:"Azzurra Bay",c:"Quartzite",p:42.79,sf:55.0,dim:"~115x69"},{n:"Bella",c:"Quartzite",p:50.16,sf:55.0,dim:"~115x69"},{n:"Blue Tahoe Satin",c:"Quartzite",p:43.58,sf:55.0,dim:"~115x69"},{n:"Blue Tahoe",c:"Quartzite",p:43.58,sf:55.0,dim:"~115x69"},{n:"Calacatta Quartzite",c:"Quartzite",p:43.57,sf:55.0,dim:"~115x69"},{n:"Calacatta Taupe",c:"Quartzite",p:32.49,sf:55.0,dim:"~115x69"},{n:"Dakar",c:"Quartzite",p:39.85,sf:55.0,dim:"~115x69"},{n:"Ebon",c:"Quartzite",p:67.18,sf:55.0,dim:"~115x69"},{n:"Ijen Blue Satin",c:"Quartzite",p:57.49,sf:55.0,dim:"~115x69"},{n:"Ijen Blue",c:"Quartzite",p:57.49,sf:55.0,dim:"~115x69"},{n:"Lavezzi",c:"Quartzite",p:45.74,sf:55.0,dim:"~115x69"},{n:"Mojave Satin",c:"Quartzite",p:41.36,sf:55.0,dim:"~115x69"},{n:"Mont Blanc Satin",c:"Quartzite",p:51.60,sf:55.0,dim:"~115x69"},{n:"Mont Blanc",c:"Quartzite",p:51.61,sf:55.0,dim:"~115x69"},{n:"Mustang",c:"Quartzite",p:39.85,sf:55.0,dim:"~115x69"},{n:"New Louise Blue",c:"Quartzite",p:79.14,sf:55.0,dim:"~115x69"},{n:"Nickel",c:"Quartzite",p:40.38,sf:55.0,dim:"~115x69"},{n:"Nuage",c:"Quartzite",p:47.43,sf:55.0,dim:"~115x69"},{n:"Paramount",c:"Quartzite",p:132.48,sf:55.0,dim:"~115x69"},{n:"Perlato Taj",c:"Quartzite",p:44.97,sf:55.0,dim:"~115x69"},{n:"Polaris",c:"Quartzite",p:55.65,sf:55.0,dim:"~115x69"},{n:"Taj Mahal Satin",c:"Quartzite",p:64.99,sf:55.0,dim:"~115x69"},{n:"Taj Mahal",c:"Quartzite",p:64.99,sf:55.0,dim:"~115x69"},{n:"Utopia",c:"Quartzite",p:49.17,sf:55.0,dim:"~115x69"},{n:"White Lux",c:"Quartzite",p:53.62,sf:55.0,dim:"~115x69"},{n:"White Pearl",c:"Quartzite",p:42.80,sf:55.0,dim:"~115x69"},
  // ─── TRAVERTINE ───
  {n:"Torreon Stone",c:"Travertine",p:26.39,sf:55.0,dim:"~115x69"},
  // ─── QUARTZ ───
  {n:"Frost-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Gemstone Beige-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Oceana-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"White Sand-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Zinc",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Aerial",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Bianco Tiza",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Carrara Breeze",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Cotton",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Crest",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Crisp Stria",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Dusk-N",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Linen-N",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Tawny",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Biancone",c:"Quartz",p:20.17,sf:58.681,dim:"130x65"},{n:"Denali-N",c:"Quartz",p:20.17,sf:55.563,dim:"127x63"},{n:"Fog",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Oxide Honed",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Oxide",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Pro Cloud",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Pro Frost",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Pro Storm",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Slate Grey-N",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Willow",c:"Quartz",p:20.17,sf:76.257,dim:"139x79"},{n:"Altais White",c:"Quartz",p:22.16,sf:69.875,dim:"129x78"},{n:"Aviana",c:"Quartz",p:22.16,sf:72.188,dim:"135x77"},{n:"Bianco Pearl",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Calacatta Alba",c:"Quartz",p:22.16,sf:76.257,dim:"139x79"},{n:"Calacatta Divine",c:"Quartz",p:22.16,sf:72.188,dim:"135x77"},{n:"Carrara Barolo",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"New Venatino Beige",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"New Venatino Grey",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Pencil Vein",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Ridge",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Serene",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Bianco Levanto",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Bellatrix",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Capella",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Jubilee",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Maywood",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Concrete Grey Honed",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Concrete Grey",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Desert Pearl",c:"Quartz",p:25.70,sf:76.257,dim:"139x79"},{n:"Haku White Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Haku White",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Hana Sky",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ivory White Honed",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Ivory White",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Pilar",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Portofino Classic Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Portofino Classic",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ripieno Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ripieno",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Sonata Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Sonata",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Valbella Gold",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Valbella Grey",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Vena",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Arabescato Como",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Calacatta Doria",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Citrine",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Firenze",c:"Quartz",p:28.48,sf:75.708,dim:"138x79"},{n:"Grigio Elegante Honed",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Grigio Elegante",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Bertoli",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Cortona Gold",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Metropolis Dark",c:"Quartz",p:29.10,sf:53.375,dim:"126x61"},{n:"New Taj",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Vallejo Gold",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Vallejo Grey",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Maxim",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Montreal",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Silver Stallion",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Zuri",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},
  // ─── PORCELAIN ───
  {n:"Arabescato Viola A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Arabescato Viola B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Bianco Namibia B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Blaze Iron (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Diamond Ivory (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Imperiale Light B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Limestone Greige (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Luna Quartzite A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Luna Quartzite B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Luna Quartzite A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Luna Quartzite B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Mont Blanc A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Mont Blanc B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Mont Blanc A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Mont Blanc B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Resin Pearl (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Resin Pepper (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Soapstone Dark (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Statuario Light A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Statuario Light B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Statuario Light A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Statuario Light B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Taj Mahal (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Taj Mahal (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Tran Beige (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Tran Ivory (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino White (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino Honey (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino Bone (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},
];

const VENDORS = { "Arizona Tile": AZ_TILE };
const DEF_FAB = 27, DEF_INST = 15;

const materialOptions = [
  { label: "Quartz", multiplier: 1.30 },
  { label: "Granite", multiplier: 1.35 },
  { label: "Marble", multiplier: 1.40 },
];

function fmt(n) { return n.toLocaleString("en-US", { style: "currency", currency: "USD" }); }
let _id = 100;
function uid() { return ++_id; }

export default function App() {
  const [sqft, setSqft] = useState("");
  const [material, setMaterial] = useState(0);
  const [materialPrice, setMaterialPrice] = useState("");
  const [slabSf, setSlabSf] = useState("");
  const [slabDim, setSlabDim] = useState("");
  const [selectedName, setSelectedName] = useState("");

  // Editable rates
  const [fabRate, setFabRate] = useState(String(DEF_FAB));
  const [instRate, setInstRate] = useState(String(DEF_INST));

  // Cutouts
  const [hasCutouts, setHasCutouts] = useState(false);
  const [cutoutDesc, setCutoutDesc] = useState("");
  const [cutoutQty, setCutoutQty] = useState("");
  const [cutoutPrice, setCutoutPrice] = useState("200");

  // Add-ons (mitring is first, permanent)
  const [addons, setAddons] = useState([
    { id: 1, name: "Mitring (sq ft)", qty: "0", price: "60", locked: true },
  ]);

  // Discounts (multiple line items)
  const [discounts, setDiscounts] = useState([]);

  // Lookup
  const [vendor, setVendor] = useState("Arizona Tile");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showLookup, setShowLookup] = useState(false);

  // Parsed
  const area = parseFloat(sqft) || 0;
  const matPrice = parseFloat(materialPrice) || 0;
  const slabSize = parseFloat(slabSf) || 0;
  const multiplier = materialOptions[material].multiplier;
  const fab = parseFloat(fabRate) || 0;
  const inst = parseFloat(instRate) || 0;
  const coQty = parseInt(cutoutQty) || 0;
  const coPrice = parseFloat(cutoutPrice) || 0;

  // Line calcs
  const materialTotal = matPrice * area * multiplier;
  const fabrication = area * fab;
  const installation = area * inst;
  const cutoutTotal = hasCutouts ? coQty * coPrice : 0;
  const addonsTotal = addons.reduce((s, a) => s + ((parseFloat(a.qty) || 0) * (parseFloat(a.price) || 0)), 0);
  const subtotal = materialTotal + fabrication + installation + cutoutTotal + addonsTotal;

  // Discounts calc
  const discountsTotal = discounts.reduce((s, d) => {
    const v = parseFloat(d.value) || 0;
    return s + (d.type === "%" ? subtotal * (v / 100) : v);
  }, 0);
  const total = Math.max(0, subtotal - discountsTotal);

  // Slab
  const slabCount = slabSize > 0 && area > 0 ? Math.ceil(area / slabSize) : 0;
  const totalSlabSf = slabCount * slabSize;
  const lastSlabUsed = slabCount > 0 ? area - (slabCount - 1) * slabSize : 0;
  const lastSlabPct = slabSize > 0 ? (lastSlabUsed / slabSize) * 100 : 0;
  const isNatStone = selectedName && !["Quartz","Porcelain"].includes(AZ_TILE.find(i => i.n === selectedName)?.c || "");

  const items = VENDORS[vendor] || [];
  const categories = useMemo(() => ["All", ...[...new Set(items.map(i => i.c))].sort()], [vendor]);
  const filtered = useMemo(() => {
    let list = items;
    if (catFilter !== "All") list = list.filter(i => i.c === catFilter);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(i => i.n.toLowerCase().includes(q)); }
    return list;
  }, [items, catFilter, search]);

  function useItemPrice(item) {
    setMaterialPrice(String(item.p));
    setSlabSf(String(item.sf));
    setSlabDim(item.dim);
    setSelectedName(item.n);
    setShowLookup(false);
  }

  function addAddon() { setAddons([...addons, { id: uid(), name: "", qty: "1", price: "", locked: false }]); }
  function removeAddon(id) { setAddons(addons.filter(a => a.id !== id)); }
  function updateAddon(id, field, val) { setAddons(addons.map(a => a.id === id ? { ...a, [field]: val } : a)); }

  function addDiscount() { setDiscounts([...discounts, { id: uid(), name: "", type: "$", value: "" }]); }
  function removeDiscount(id) { setDiscounts(discounts.filter(d => d.id !== id)); }
  function updateDiscount(id, field, val) { setDiscounts(discounts.map(d => d.id === id ? { ...d, [field]: val } : d)); }

  function resetRate(setter, def) { setter(String(def)); }

  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inpSm = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-lg space-y-4 pb-12">
        <h1 className="text-2xl font-bold text-white mb-1">Price Estimate</h1>
        <p className="text-gray-400 text-sm mb-2">Enter project details to generate a customer quote.</p>

        {/* ── CORE ── */}
        <Section>
          <Field label="Total Project Area (sq ft)">
            <input type="number" min="0" value={sqft} onChange={e => setSqft(e.target.value)} placeholder="0" className={inp} />
          </Field>

          <Field label="Material Type">
            <div className="grid grid-cols-3 gap-2">
              {materialOptions.map((opt, i) => (
                <button key={opt.label} onClick={() => setMaterial(i)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${material === i
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500"}`}>
                  {opt.label}<span className="block text-xs mt-0.5 opacity-70">x{opt.multiplier.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Material Price ($ per sq ft)">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" min="0" value={materialPrice} onChange={e => setMaterialPrice(e.target.value)} placeholder="0.00" className={`${inp} pl-7`} />
              </div>
              <button onClick={() => setShowLookup(!showLookup)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${showLookup ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-400 border border-gray-700 hover:border-blue-500"}`}>
                {showLookup ? "Close" : "Find Price"}
              </button>
            </div>
          </Field>

          <Field label={<>Slab Size (sq ft per slab){isNatStone && <span className="text-yellow-400 text-xs ml-2">* Estimate</span>}</>}>
            <input type="number" min="0" value={slabSf} onChange={e => { setSlabSf(e.target.value); setSlabDim(""); }} placeholder="e.g. 55.125" className={inp} />
            {slabDim && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-gray-400">Slab dimensions:</span>
                <span className={`text-xs font-medium ${slabDim.startsWith("~") ? "text-yellow-400" : "text-blue-400"}`}>
                  {slabDim}" {slabDim.startsWith("~") ? "(approx — varies by lot)" : ""}
                </span>
              </div>
            )}
            {isNatStone && !slabDim.startsWith("~") ? null : isNatStone && (
              <p className="text-xs text-yellow-400 mt-1">Natural stone sizes vary. Adjust if you know the actual dimensions.</p>
            )}
          </Field>
        </Section>

        {/* ── LOOKUP ── */}
        {showLookup && (
          <div className="bg-gray-900 rounded-xl p-5 border border-blue-800 space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Find Material Price</h2>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vendor</label>
              <select value={vendor} onChange={e => { setVendor(e.target.value); setCatFilter("All"); setSearch(""); }} className={inpSm}>
                {Object.keys(VENDORS).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className={inpSm}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Search</label>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. Calacatta..." className={inpSm} />
            </div>
            <div className="text-xs text-gray-500">{filtered.length} items</div>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 && <div className="text-gray-500 text-sm py-4 text-center">No materials found</div>}
              {filtered.map((item, i) => (
                <button key={i} onClick={() => useItemPrice(item)}
                  className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 hover:border-blue-600 rounded-lg px-3 py-2 text-left transition-all">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium truncate">{item.n}</div>
                    <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
                      <span>{item.c}</span>
                      <span className="text-gray-500">{item.sf} sf</span>
                      <span className="text-gray-500">{item.dim}"</span>
                    </div>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <div className="text-sm font-bold text-green-400">${item.p.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">per sf</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SLAB USAGE ── */}
        {slabCount > 0 && (
          <div className={`rounded-xl p-5 border ${lastSlabPct <= 10 ? "bg-yellow-950 border-yellow-700" : "bg-gray-900 border-gray-800"}`}>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Slab Usage</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300"><span>Slabs needed</span><span className="font-bold text-white text-lg">{slabCount}</span></div>
              <div className="flex justify-between text-gray-300"><span>Total slab coverage</span><span>{totalSlabSf.toFixed(1)} sf</span></div>
              <div className="flex justify-between text-gray-300"><span>Waste / leftover</span><span>{(totalSlabSf - area).toFixed(1)} sf</span></div>
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Last slab usage</span><span className={lastSlabPct <= 10 ? "text-yellow-400 font-bold" : ""}>{lastSlabPct.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${lastSlabPct <= 10 ? "bg-yellow-500" : lastSlabPct <= 25 ? "bg-orange-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(lastSlabPct, 100)}%` }} />
                </div>
              </div>
              {lastSlabPct <= 10 && (
                <div className="mt-3 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <p className="text-yellow-300 text-sm font-medium">Low usage on last slab</p>
                  <p className="text-yellow-400 text-xs mt-1">Only using {lastSlabPct.toFixed(1)}% ({lastSlabUsed.toFixed(1)} sf). Consider a seam adjustment to fit on {slabCount - 1} slab{slabCount - 1 !== 1 ? "s" : ""}.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADDITIONAL COSTS (Cutouts + Add-ons including Mitring) ── */}
        <Section title="Additional Costs">
          {/* Cutouts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Sink / Fixture Cutouts</span>
              <button onClick={() => setHasCutouts(!hasCutouts)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${hasCutouts ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 border border-gray-700"}`}>
                {hasCutouts ? "Yes" : "No"}
              </button>
            </div>
            {hasCutouts && (
              <div className="space-y-3 pl-2 border-l-2 border-gray-700">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input type="text" value={cutoutDesc} onChange={e => setCutoutDesc(e.target.value)} placeholder="e.g. Undermount sink, Drop-in, Farmer" className={inpSm} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-gray-400 mb-1">Qty</label><input type="number" min="0" value={cutoutQty} onChange={e => setCutoutQty(e.target.value)} placeholder="0" className={inpSm} /></div>
                  <div><label className="block text-xs text-gray-400 mb-1">Price each ($)</label><input type="number" min="0" value={cutoutPrice} onChange={e => setCutoutPrice(e.target.value)} placeholder="200" className={inpSm} /></div>
                </div>
                <div className="text-xs text-gray-500">Typical: $200/ea (under 50") · $250/ea (over 50"). Undermount, drop-in, farmer.</div>
                {coQty > 0 && coPrice > 0 && <div className="text-sm text-green-400 font-medium">Cutout total: {fmt(cutoutTotal)}</div>}
              </div>
            )}
          </div>

          {/* Add-ons (Mitring first, then custom) */}
          <div className="pt-3 border-t border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Add-ons</span>
              <button onClick={addAddon} className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-800 text-blue-400 border border-gray-700 hover:border-blue-500">+ Add</button>
            </div>
            {addons.map(a => (
              <div key={a.id} className="flex gap-2 items-end pl-2 border-l-2 border-gray-700">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input type="text" value={a.name} onChange={e => updateAddon(a.id, "name", e.target.value)}
                    placeholder={a.locked ? "" : "e.g. Waterfall edge"}
                    readOnly={a.locked}
                    className={`${inpSm} ${a.locked ? "opacity-70" : ""}`} />
                </div>
                <div className="w-16">
                  <label className="block text-xs text-gray-400 mb-1">{a.locked ? "Sq ft" : "Qty"}</label>
                  <input type="number" min="0" value={a.qty} onChange={e => updateAddon(a.id, "qty", e.target.value)} className={inpSm} />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-400 mb-1">$/ea</label>
                  <input type="number" min="0" value={a.price} onChange={e => updateAddon(a.id, "price", e.target.value)} placeholder="0" className={inpSm} />
                </div>
                {!a.locked && (
                  <button onClick={() => removeAddon(a.id)} className="pb-2.5 text-red-400 hover:text-red-300 text-lg font-bold leading-none">&times;</button>
                )}
                {a.locked && <div className="w-5" />}
              </div>
            ))}
          </div>
        </Section>

        {/* ── RATES & DISCOUNTS ── */}
        <Section title="Rates & Discounts">
          <div className="space-y-3">
            <RateField label="Fabrication ($/sf)" value={fabRate} onChange={setFabRate} def={DEF_FAB} onReset={() => resetRate(setFabRate, DEF_FAB)} />
            <RateField label="Installation ($/sf)" value={instRate} onChange={setInstRate} def={DEF_INST} onReset={() => resetRate(setInstRate, DEF_INST)} />
          </div>

          <div className="pt-3 border-t border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Discounts</span>
              <button onClick={addDiscount} className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-800 text-blue-400 border border-gray-700 hover:border-blue-500">+ Add</button>
            </div>
            {discounts.length === 0 && <p className="text-xs text-gray-500">No discounts applied.</p>}
            {discounts.map(d => {
              const v = parseFloat(d.value) || 0;
              const amt = d.type === "%" ? subtotal * (v / 100) : v;
              return (
                <div key={d.id} className="flex gap-2 items-end pl-2 border-l-2 border-gray-700">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                    <input type="text" value={d.name} onChange={e => updateDiscount(d.id, "name", e.target.value)} placeholder="e.g. Loyalty discount" className={inpSm} />
                  </div>
                  <div className="w-16">
                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                    <select value={d.type} onChange={e => updateDiscount(d.id, "type", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="$">$</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-400 mb-1">Amount</label>
                    <input type="number" min="0" value={d.value} onChange={e => updateDiscount(d.id, "value", e.target.value)} placeholder="0" className={inpSm} />
                  </div>
                  <button onClick={() => removeDiscount(d.id)} className="pb-2.5 text-red-400 hover:text-red-300 text-lg font-bold leading-none">&times;</button>
                </div>
              );
            })}
            {discountsTotal > 0 && <div className="text-sm text-red-400 font-medium">Total discounts: -{fmt(discountsTotal)}</div>}
          </div>
        </Section>

        {/* ── COST BREAKDOWN ── */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Cost Breakdown</h2>
          <div className="space-y-2.5 text-sm">
            {selectedName && <div className="text-xs text-blue-400 mb-2">Material: {selectedName}</div>}
            <Row label={`Material (${fmt(matPrice)}/sf × ${area} sf × ${multiplier.toFixed(2)})`} value={materialTotal} bold />
            <Row label={`Fabrication (${area} sf × $${fab})`} value={fabrication} />
            <Row label={`Installation (${area} sf × $${inst})`} value={installation} />
            {cutoutTotal > 0 && <Row label={`${cutoutDesc || "Cutouts"} (${coQty} × ${fmt(coPrice)})`} value={cutoutTotal} />}
            {addons.filter(a => (parseFloat(a.qty)||0) * (parseFloat(a.price)||0) > 0).map(a => (
              <Row key={a.id} label={`${a.name || "Add-on"} (${a.qty} × ${fmt(parseFloat(a.price)||0)})`} value={(parseFloat(a.qty)||0) * (parseFloat(a.price)||0)} />
            ))}
            {discounts.filter(d => (parseFloat(d.value)||0) > 0).map(d => {
              const v = parseFloat(d.value) || 0;
              const amt = d.type === "%" ? subtotal * (v / 100) : v;
              return (
                <div key={d.id} className="flex justify-between text-red-400">
                  <span>{d.name || "Discount"} {d.type === "%" ? `(${v}%)` : ""}</span>
                  <span>-{fmt(amt)}</span>
                </div>
              );
            })}
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Estimate Total</span>
                <span className="text-2xl font-bold text-green-400">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (<div className="bg-gray-900 rounded-xl p-5 space-y-5 border border-gray-800">{title && <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{title}</h2>}{children}</div>);
}
function Field({ label, children }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>{children}</div>;
}
function Row({ label, value, bold }) {
  return <div className={`flex justify-between ${bold ? "font-semibold text-white" : "text-gray-300"}`}><span>{label}</span><span>{fmt(value)}</span></div>;
}
function RateField({ label, value, onChange, def, onReset }) {
  const changed = parseFloat(value) !== def;
  return (
    <div>
      <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-400">{label}</label>{changed && <button onClick={onReset} className="text-xs text-blue-400 hover:text-blue-300">Reset to ${def}</button>}</div>
      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
        <input type="number" min="0" value={value} onChange={e => onChange(e.target.value)} className={`w-full bg-gray-800 border rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${changed ? "border-blue-600" : "border-gray-700"}`} /></div>
    </div>
  );
}
