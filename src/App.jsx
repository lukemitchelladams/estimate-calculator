import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR CONTACT INFO
// Shown whenever a price entry has est:true (slab size is estimated/uncertain)
// ─────────────────────────────────────────────────────────────────────────────
// src values:
//   "both"         — vendor price sheet published both $/SF and total slab price ✓
//   "psf"          — vendor price sheet published $/SF only ✓
//   "slab_calc"    — vendor published total slab price only; $/SF was back-calculated ⚠
//   "margin_calc"  — $/SF derived from internal cost sheet using location margin formula ⚠
const VENDOR_INFO = {
  "Arizona Tile":      {
    name: "Arizona Tile — Denver", phone: "(303) 574-2990", address: "10100 E 45th Ave, Denver, CO 80238",
    src: "psf",
    srcMsg: "Vendor price sheet provides price per square foot directly. Total slab price was not listed — call the vendor if you need the per-slab figure.",
  },
  "Caesarstone":       {
    name: "Caesarstone", phone: "(877) 978-2789", address: "Caesarstone HQ — call for local availability",
    src: "both",
    srcMsg: "Vendor price sheet provides both price per square foot and total slab price. Pricing verified directly from published price list.",
  },
  "Cambria":           {
    name: "Cambria Center Showroom — Denver", phone: "(720) 419-1365", address: "495 E 62nd Ave Ste 100, Denver, CO 80216",
    src: "both",
    srcMsg: "Vendor price sheet provides both price per square foot and total slab price. Pricing verified directly from published price list.",
  },
  "StratusQuartz":     {
    name: "Stratus Surfaces — Denver", phone: "(720) 778-0437", address: "9575 E 40th Ave Suite 140, Denver, CO 80238",
    src: "psf",
    srcMsg: "Vendor price sheet provides price per square foot directly (single-slab/loose rate). Total slab price was not listed — call the vendor if you need the per-slab figure.",
  },
  "PentalQuartz":      {
    name: "Architectural Surfaces — Denver", phone: "(720) 512-4200", address: "10000 E 40th Ave, Denver, CO 80238",
    src: "both",
    srcMsg: "Vendor price sheet provides both price per square foot and total slab price. Pricing verified directly from published price list.",
  },
  "MSI":               {
    name: "MSI Denver", phone: "(720) 624-2700", address: "18250 E 40th Ave #30, Aurora, CO 80011",
    src: "psf",
    srcMsg: "Vendor price sheet provides price per square foot directly (loose/single-slab rate). Total slab price was not listed — call the vendor if you need the per-slab figure.",
  },
  "HanStone":          {
    name: "Edgebanding Services Inc (ESI) — Denver", phone: "(303) 295-1546", address: "5977 Broadway, Denver, CO 80216",
    src: "slab_calc",
    srcMsg: "Vendor price sheet provides a total per-slab price only — price per square foot was not listed. The $/SF shown here was calculated using a standard 61×126\" slab (53.38 sf). Call the vendor to confirm current per-SF pricing and exact slab dimensions for the color you're quoting.",
  },
  "Granite Imports":   {
    name: "Granite Imports — Denver", phone: "(303) 733-1444", address: "1301 S Platte River Dr, Denver, CO 80223",
    src: "psf",
    srcMsg: "Vendor price sheet provides price per square foot directly. Total slab price was not listed — call the vendor if you need the per-slab figure.",
  },
  "Wilsonart / Metro": {
    name: "Wilsonart — Denver", phone: "(720) 824-5300", address: "525 E 58th Ave Suite 300, Denver, CO 80216",
    src: "margin_calc",
    srcMsg: "Price per square foot was calculated from the vendor's internal cost spreadsheet using the Denver location sell margin (35%). Neither the price sheet nor the price card publishes a direct $/SF or slab price — call the vendor to confirm current pricing before finalizing any quote.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARIZONA TILE  (existing vendor — 3cm only)
// Natural stone: dim starts with "~" and est:true because lot sizes vary
// ─────────────────────────────────────────────────────────────────────────────
const NAT_STONE_NOTE = "Natural stone slab sizes vary by lot. The ~55 sf figure is a typical industry estimate — actual dimensions depend on which slab you pull. Call the vendor to confirm the exact size before finalizing your quote.";

const AZ_TILE = [
  // ─── GRANITE ───
  {n:"Atacama",c:"Granite",p:21.14,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Atlantico",c:"Granite",p:10.29,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Avocatus Satin",c:"Granite",p:55.04,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Barcelona",c:"Granite",p:10.04,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Belvedere Satin",c:"Granite",p:50.16,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bianco Typhoon Satin",c:"Granite",p:15.95,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bianco Typhoon",c:"Granite",p:15.95,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Black Mist Honed",c:"Granite",p:17.75,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Black Pearl Satin",c:"Granite",p:17.53,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Black Pearl",c:"Granite",p:17.59,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bliss",c:"Granite",p:11.44,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Blizzard",c:"Granite",p:18.58,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bluzonite",c:"Granite",p:27.72,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Carbon Grey Satin",c:"Granite",p:38.39,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Colonial White",c:"Granite",p:21.59,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Dallas White",c:"Granite",p:11.36,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Delicatus White",c:"Granite",p:26.61,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Desert Canyon",c:"Granite",p:51.65,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Indian Premium Black Honed",c:"Granite",p:33.70,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Indian Premium Black Satin",c:"Granite",p:33.70,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Indian Premium Black",c:"Granite",p:33.70,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Kalahari",c:"Granite",p:20.37,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Kashmire Cream",c:"Granite",p:26.40,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Monte Cristo Satin",c:"Granite",p:24.09,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Monte Cristo",c:"Granite",p:24.11,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Negresco Satin",c:"Granite",p:37.61,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"New Caledonia",c:"Granite",p:11.38,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"New Romano Satin",c:"Granite",p:18.31,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"New Romano",c:"Granite",p:18.31,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"New Valle Nevado",c:"Granite",p:11.36,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Silver Cloud Satin",c:"Granite",p:16.89,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Silver Falls",c:"Granite",p:15.90,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Snowridge",c:"Granite",p:15.36,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"St Cecilia Light",c:"Granite",p:12.02,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"St Cecilia White",c:"Granite",p:11.03,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Steel Grey Satin",c:"Granite",p:17.54,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Steel Grey",c:"Granite",p:17.62,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Titanium",c:"Granite",p:28.88,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Typhoon Bordeaux",c:"Granite",p:38.39,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Verde Ubatuba",c:"Granite",p:11.80,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Viridian",c:"Granite",p:57.91,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Viscount White",c:"Granite",p:16.63,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Volcano",c:"Granite",p:37.16,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Whisper White",c:"Granite",p:20.34,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  // ─── MARBLE & DOLOMITE ───
  {n:"Bianco Carrara Honed",c:"Marble",p:26.65,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bianco Carrara",c:"Marble",p:26.65,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Calacatta Umber Honed",c:"Marble",p:51.03,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Black Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Blue Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Brown Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Brown",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Ocean Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Statuary Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Fantasy Zebra Satin",c:"Marble & Dolomite",p:26.98,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Opal White Satin",c:"Marble",p:31.64,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Opal White",c:"Marble",p:31.64,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  // ─── QUARTZITE ───
  {n:"Aqua Venato",c:"Quartzite",p:40.95,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Artemis",c:"Quartzite",p:46.90,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Azzurra Bay",c:"Quartzite",p:42.79,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Bella",c:"Quartzite",p:50.16,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Blue Tahoe Satin",c:"Quartzite",p:43.58,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Blue Tahoe",c:"Quartzite",p:43.58,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Calacatta Quartzite",c:"Quartzite",p:43.57,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Calacatta Taupe",c:"Quartzite",p:32.49,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Dakar",c:"Quartzite",p:39.85,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Ebon",c:"Quartzite",p:67.18,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Ijen Blue Satin",c:"Quartzite",p:57.49,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Ijen Blue",c:"Quartzite",p:57.49,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Lavezzi",c:"Quartzite",p:45.74,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Mojave Satin",c:"Quartzite",p:41.36,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Mont Blanc Satin",c:"Quartzite",p:51.60,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Mont Blanc",c:"Quartzite",p:51.61,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Mustang",c:"Quartzite",p:39.85,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"New Louise Blue",c:"Quartzite",p:79.14,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Nickel",c:"Quartzite",p:40.38,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Nuage",c:"Quartzite",p:47.43,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Paramount",c:"Quartzite",p:132.48,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Perlato Taj",c:"Quartzite",p:44.97,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Polaris",c:"Quartzite",p:55.65,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Taj Mahal Satin",c:"Quartzite",p:64.99,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Taj Mahal",c:"Quartzite",p:64.99,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"Utopia",c:"Quartzite",p:49.17,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"White Lux",c:"Quartzite",p:53.62,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  {n:"White Pearl",c:"Quartzite",p:42.80,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  // ─── TRAVERTINE ───
  {n:"Torreon Stone",c:"Travertine",p:26.39,sf:55.0,dim:"~115x69",est:true,note:NAT_STONE_NOTE},
  // ─── QUARTZ (engineered — exact dimensions, no est flag) ───
  {n:"Frost-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Gemstone Beige-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Oceana-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"White Sand-N",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Zinc",c:"Quartz",p:14.44,sf:55.125,dim:"126x63"},{n:"Aerial",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Bianco Tiza",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Carrara Breeze",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Cotton",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Crest",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Crisp Stria",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Dusk-N",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Linen-N",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Tawny",c:"Quartz",p:16.50,sf:55.125,dim:"126x63"},{n:"Biancone",c:"Quartz",p:20.17,sf:58.681,dim:"130x65"},{n:"Denali-N",c:"Quartz",p:20.17,sf:55.563,dim:"127x63"},{n:"Fog",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Oxide Honed",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Oxide",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Pro Cloud",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Pro Frost",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Pro Storm",c:"Quartz",p:20.17,sf:53.375,dim:"126x61"},{n:"Slate Grey-N",c:"Quartz",p:20.17,sf:55.125,dim:"126x63"},{n:"Willow",c:"Quartz",p:20.17,sf:76.257,dim:"139x79"},{n:"Altais White",c:"Quartz",p:22.16,sf:69.875,dim:"129x78"},{n:"Aviana",c:"Quartz",p:22.16,sf:72.188,dim:"135x77"},{n:"Bianco Pearl",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Calacatta Alba",c:"Quartz",p:22.16,sf:76.257,dim:"139x79"},{n:"Calacatta Divine",c:"Quartz",p:22.16,sf:72.188,dim:"135x77"},{n:"Carrara Barolo",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"New Venatino Beige",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"New Venatino Grey",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Pencil Vein",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Ridge",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Serene",c:"Quartz",p:22.16,sf:55.125,dim:"126x63"},{n:"Bianco Levanto",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Bellatrix",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Capella",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Jubilee",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Calacatta Maywood",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Concrete Grey Honed",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Concrete Grey",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Desert Pearl",c:"Quartz",p:25.70,sf:76.257,dim:"139x79"},{n:"Haku White Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Haku White",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Hana Sky",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ivory White Honed",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Ivory White",c:"Quartz",p:25.70,sf:53.375,dim:"126x61"},{n:"Pilar",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Portofino Classic Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Portofino Classic",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ripieno Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Ripieno",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Sonata Honed",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Sonata",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Valbella Gold",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Valbella Grey",c:"Quartz",p:25.70,sf:55.125,dim:"126x63"},{n:"Vena",c:"Quartz",p:25.70,sf:58.681,dim:"130x65"},{n:"Arabescato Como",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Calacatta Doria",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Citrine",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Firenze",c:"Quartz",p:28.48,sf:75.708,dim:"138x79"},{n:"Grigio Elegante Honed",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Grigio Elegante",c:"Quartz",p:28.48,sf:55.125,dim:"126x63"},{n:"Bertoli",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Cortona Gold",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Metropolis Dark",c:"Quartz",p:29.10,sf:53.375,dim:"126x61"},{n:"New Taj",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Vallejo Gold",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Vallejo Grey",c:"Quartz",p:29.10,sf:55.125,dim:"126x63"},{n:"Maxim",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Montreal",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Silver Stallion",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},{n:"Zuri",c:"Quartz",p:41.60,sf:55.125,dim:"126x63"},
  // ─── PORCELAIN ───
  {n:"Arabescato Viola A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Arabescato Viola B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Bianco Namibia A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Bianco Namibia B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Blaze Iron (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Calacatta Michelangelo B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Diamond Ivory (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Imperiale Light A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Imperiale Light B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Limestone Greige (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Luna Quartzite A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Luna Quartzite B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Luna Quartzite A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Luna Quartzite B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Extra B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Prestigio B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Calacatta Apuano B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Fior Di Bosco B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Marvel Black Atlantis B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Mont Blanc A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Mont Blanc B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Mont Blanc A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Mont Blanc B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Resin Pearl (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Resin Pepper (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Soapstone Dark (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Statuario Light A (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Statuario Light B (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Statuario Light A (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Statuario Light B (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Taj Mahal (Pol)",c:"Porcelain",p:20.46,sf:55.125,dim:"126x63"},{n:"Taj Mahal (Soft)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Tran Beige (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Tran Ivory (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino White (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino Honey (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},{n:"Travertino Bone (Matte)",c:"Porcelain",p:17.82,sf:55.125,dim:"126x63"},
];

// ─────────────────────────────────────────────────────────────────────────────
// CAESARSTONE  — 3cm only, Effective October 1, 2025
// Exact slab sizes published by vendor. No estimates.
// Standard = 120x56.5" (47.08 sf) | Jumbo = 131.5x64.6" (58.9 sf)
// Porcelain = 124.5x61.5" (53.17 sf)
// ─────────────────────────────────────────────────────────────────────────────
const CAESARSTONE = [
  {n:"Essentials 3cm (Standard)",c:"Quartz",p:35.72,sf:47.08,dim:"120x56.5"},
  {n:"Essentials 3cm (Jumbo)",c:"Quartz",p:35.71,sf:58.9,dim:"131.5x64.6"},
  {n:"Standard 3cm (Standard)",c:"Quartz",p:41.85,sf:47.08,dim:"120x56.5"},
  {n:"Standard 3cm (Jumbo)",c:"Quartz",p:41.74,sf:58.9,dim:"131.5x64.6"},
  {n:"Premium 3cm (Standard)",c:"Quartz",p:55.17,sf:47.08,dim:"120x56.5"},
  {n:"Premium 3cm (Jumbo)",c:"Quartz",p:55.12,sf:58.9,dim:"131.5x64.6"},
  {n:"Supernatural 3cm (Standard)",c:"Quartz",p:62.36,sf:47.08,dim:"120x56.5"},
  {n:"Supernatural 3cm (Jumbo)",c:"Quartz",p:62.10,sf:58.9,dim:"131.5x64.6"},
  {n:"Supernatural Ultra 3cm (Standard)",c:"Quartz",p:85.23,sf:47.08,dim:"120x56.5"},
  {n:"Supernatural Ultra 3cm (Jumbo)",c:"Quartz",p:85.28,sf:58.9,dim:"131.5x64.6"},
  {n:"Outdoor 3cm (Standard)",c:"Outdoor",p:72.25,sf:47.08,dim:"120x56.5"},
  {n:"Mineral Standard 3cm (Standard)",c:"Mineral",p:41.85,sf:47.08,dim:"120x56.5"},
  {n:"Mineral Standard 3cm (Jumbo)",c:"Mineral",p:41.74,sf:58.9,dim:"131.5x64.6"},
  {n:"Mineral Premium 3cm (Standard)",c:"Mineral",p:55.17,sf:47.08,dim:"120x56.5"},
  {n:"Mineral Premium 3cm (Jumbo)",c:"Mineral",p:55.12,sf:58.9,dim:"131.5x64.6"},
  {n:"Mineral Supernatural 3cm (Jumbo)",c:"Mineral",p:62.10,sf:58.9,dim:"131.5x64.6"},
  {n:"Mineral Supernatural Ultra 3cm (Jumbo)",c:"Mineral",p:85.28,sf:58.9,dim:"131.5x64.6"},
  {n:"Advanced Fusion Premium 3cm",c:"Advanced Fusion",p:55.12,sf:58.9,dim:"131.5x64.6"},
  {n:"Advanced Fusion Supernatural 3cm",c:"Advanced Fusion",p:62.10,sf:58.9,dim:"131.5x64.6"},
  {n:"Advanced Fusion Supernatural ICON 3cm",c:"Advanced Fusion",p:65.20,sf:58.9,dim:"131.5x64.6"},
  {n:"Advanced Fusion Supernatural Ultra 3cm",c:"Advanced Fusion",p:85.28,sf:58.9,dim:"131.5x64.6"},
  {n:"Advanced Fusion Supernatural Ultra ICON 3cm",c:"Advanced Fusion",p:89.54,sf:58.9,dim:"131.5x64.6"},
  {n:"Porcelain Standard 12mm",c:"Porcelain",p:23.02,sf:53.17,dim:"124.5x61.5"},
  {n:"Porcelain Premium 20mm",c:"Porcelain",p:43.69,sf:53.17,dim:"124.5x61.5"},
  {n:"Porcelain Supernatural 20mm",c:"Porcelain",p:48.45,sf:53.17,dim:"124.5x61.5"},
  {n:"Porcelain Supernatural Ultra 20mm",c:"Porcelain",p:51.91,sf:53.17,dim:"124.5x61.5"},
];

// ─────────────────────────────────────────────────────────────────────────────
// CAMBRIA  — 3cm only, Effective January 1, 2026
// Exact slab sizes: Jumbo = 65.5x132" (60 sf) | Standard = 55.5x122" (47 sf)
// The price list specifies which size each design comes in.
// Most designs are Jumbo (60 sf). Beaumont & Brecon Brown only come in Standard (47 sf).
// ─────────────────────────────────────────────────────────────────────────────
const CAMBRIA = [
  {n:"Classic 3cm (Jumbo - 60sf)",c:"Classic",p:34.10,sf:60,dim:"65.5x132"},
  {n:"Classic 3cm (Standard - 47sf)",c:"Classic",p:34.10,sf:47,dim:"55.5x122"},
  {n:"Signature 3cm",c:"Signature",p:36.90,sf:60,dim:"65.5x132"},
  {n:"Coordinates 3cm",c:"Coordinates",p:42.05,sf:60,dim:"65.5x132"},
  {n:"Luxury 3cm",c:"Luxury",p:48.40,sf:60,dim:"65.5x132"},
  {n:"Grandeur 3cm",c:"Grandeur",p:52.85,sf:60,dim:"65.5x132"},
];

// ─────────────────────────────────────────────────────────────────────────────
// STRATUS QUARTZ  — 3cm only, Effective January 5, 2026 (FOB Denver, CO)
// Price = single-slab/loose per SF. Slab sizes from published price list.
// ─────────────────────────────────────────────────────────────────────────────
const STRATUS_QUARTZ = [
  {n:"Group 0 - 3cm",c:"Quartz",p:13.90,sf:73.67,dim:"136x78"},
  {n:"Group 0B - 3cm",c:"Quartz",p:14.90,sf:73.67,dim:"136x78"},
  {n:"Group 1 - 3cm",c:"Quartz",p:15.90,sf:73.67,dim:"136x78"},
  {n:"Group 1B - 3cm",c:"Quartz",p:18.90,sf:79.72,dim:"140x82"},
  {n:"Group 2 - 3cm",c:"Quartz",p:19.90,sf:73.67,dim:"136x78"},
  {n:"Group 2B - 3cm",c:"Quartz",p:20.90,sf:77.22,dim:"139x80"},
  {n:"Group 3 - 3cm",c:"Quartz",p:22.90,sf:58.68,dim:"130x65"},
  {n:"Group 4 - 3cm",c:"Quartz",p:25.90,sf:58.68,dim:"130x65"},
  {n:"Group 5 - 3cm",c:"Quartz",p:27.90,sf:58.68,dim:"130x65"},
  {n:"Group 6 - 3cm",c:"Quartz",p:31.90,sf:79.72,dim:"140x82"},
  {n:"Group 6B - 3cm",c:"Quartz",p:34.90,sf:79.72,dim:"140x82"},
  {n:"Group 7 - 3cm",c:"Quartz",p:37.90,sf:79.72,dim:"140x82"},
];

// ─────────────────────────────────────────────────────────────────────────────
// PENTAL QUARTZ  — 3cm only, Denver, Current as of January 2, 2026
// Individual color names, sizes, and $/SF from published price list.
// All sizes exact as published. Materials with two available sizes listed separately.
// "While supplies last" items included and noted.
// ─────────────────────────────────────────────────────────────────────────────
const PENTAL = [
  // ─── GROUP 0 — $13.00/sf ───
  {n:"Carrara Vario",c:"Quartz",p:13.00,sf:75.16,dim:"137x79"},
  {n:"Pearl White",c:"Quartz",p:13.00,sf:75.16,dim:"137x79"},
  {n:"Seashell",c:"Quartz",p:13.00,sf:75.16,dim:"137x79"},
  // ─── GROUP 1 — $16.30/sf ───
  {n:"Bianco Aspen",c:"Quartz",p:16.30,sf:71.32,dim:"130x79"},
  {n:"Bianco Sol",c:"Quartz",p:16.30,sf:75.16,dim:"137x79"},
  {n:"Super White",c:"Quartz",p:16.30,sf:75.16,dim:"137x79"},
  {n:"Calacatta Caldise (WSL)",c:"Quartz",p:16.30,sf:71.32,dim:"130x79"},
  {n:"Terra Lite (WSL)",c:"Quartz",p:16.30,sf:71.32,dim:"130x79"},
  {n:"Terra Lite Gold (WSL)",c:"Quartz",p:16.30,sf:71.32,dim:"130x79"},
  // ─── GROUP 2 — $18.85/sf ───
  {n:"Haleo",c:"Quartz",p:18.85,sf:75.71,dim:"138x79"},
  {n:"Mia",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  {n:"Myora (130x65)",c:"Quartz",p:18.85,sf:58.68,dim:"130x65"},
  {n:"Myora (137x79)",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  {n:"Myora Gold (130x65)",c:"Quartz",p:18.85,sf:58.68,dim:"130x65"},
  {n:"Myora Gold (137x79)",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  {n:"Salora Gold",c:"Quartz",p:18.85,sf:71.32,dim:"130x79"},
  {n:"Salora Grey",c:"Quartz",p:18.85,sf:71.32,dim:"130x79"},
  {n:"Terra Sky / Terra Luna (126x63)",c:"Quartz",p:18.85,sf:55.13,dim:"126x63"},
  {n:"Terra Sky / Terra Luna (137x79)",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  {n:"Terra Sky Gold / Terra Sol (126x63)",c:"Quartz",p:18.85,sf:55.13,dim:"126x63"},
  {n:"Terra Sky Gold / Terra Sol (137x79)",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  {n:"Myora Honed (WSL)",c:"Quartz",p:18.85,sf:58.68,dim:"130x65"},
  {n:"Mystique (WSL, 126x63)",c:"Quartz",p:18.85,sf:55.13,dim:"126x63"},
  {n:"Mystique (WSL, 130x65)",c:"Quartz",p:18.85,sf:58.68,dim:"130x65"},
  {n:"Thassos (WSL)",c:"Quartz",p:18.85,sf:75.16,dim:"137x79"},
  // ─── GROUP 3 — $21.50/sf ───
  {n:"Aegean",c:"Quartz",p:21.50,sf:55.13,dim:"126x63"},
  {n:"Atmos Gold",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Aura Gold",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  {n:"Claro Oro / Luce Oro",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Enza Oro",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Marestar",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Tempo Valore",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Terra Noir / Lux Noir (126x63)",c:"Quartz",p:21.50,sf:55.13,dim:"126x63"},
  {n:"Terra Noir / Lux Noir (137x79)",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"Aura (WSL)",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  {n:"Celadon (WSL)",c:"Quartz",p:21.50,sf:55.13,dim:"126x63"},
  {n:"Elara (WSL)",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  {n:"Ijen (WSL)",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  {n:"Ivory Mist Honed (WSL)",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  {n:"Navea Gold (WSL)",c:"Quartz",p:21.50,sf:75.16,dim:"137x79"},
  {n:"River Mist (WSL)",c:"Quartz",p:21.50,sf:75.71,dim:"138x79"},
  {n:"River Mist Gold (WSL)",c:"Quartz",p:21.50,sf:75.71,dim:"138x79"},
  {n:"Vezzano (WSL)",c:"Quartz",p:21.50,sf:58.68,dim:"130x65"},
  // ─── GROUP 4 — $27.00/sf ───
  {n:"Blossom Mist",c:"Quartz",p:27.00,sf:75.16,dim:"137x79"},
  {n:"Cielo Blue",c:"Quartz",p:27.00,sf:75.16,dim:"137x79"},
  {n:"Cielo Sky",c:"Quartz",p:27.00,sf:75.16,dim:"137x79"},
  {n:"Eclipse",c:"Quartz",p:27.00,sf:58.68,dim:"130x65"},
  {n:"Midnight Mist Honed",c:"Quartz",p:27.00,sf:58.68,dim:"130x65"},
  {n:"Nightfall Honed",c:"Quartz",p:27.00,sf:58.68,dim:"130x65"},
  {n:"Tavera Gold / Tramonto (126x63)",c:"Quartz",p:27.00,sf:55.13,dim:"126x63"},
  {n:"Tavera Gold / Tramonto (137x79)",c:"Quartz",p:27.00,sf:75.16,dim:"137x79"},
  {n:"Crema Claret (WSL)",c:"Quartz",p:27.00,sf:75.16,dim:"137x79"},
  {n:"Lunaria (WSL)",c:"Quartz",p:27.00,sf:58.68,dim:"130x65"},
  {n:"Stella Black (WSL)",c:"Quartz",p:27.00,sf:55.13,dim:"126x63"},
  {n:"Valla (WSL)",c:"Quartz",p:27.00,sf:55.13,dim:"126x63"},
  // ─── GROUP 5 — $32.60/sf ───
  {n:"Claro Cascade / Luce Cascade",c:"Quartz",p:32.60,sf:75.16,dim:"137x79"},
  {n:"Oceanus (B&B Backlit)",c:"Quartz",p:32.60,sf:75.16,dim:"137x79"},
  {n:"Unique Calacatta",c:"Quartz",p:32.60,sf:57.78,dim:"130x64"},
  {n:"Unique Calacatta Blue",c:"Quartz",p:32.60,sf:57.78,dim:"130x64"},
  {n:"Unique Calacatta Gold",c:"Quartz",p:32.60,sf:57.78,dim:"130x64"},
  {n:"Unique Calacatta Macchia Vecchia",c:"Quartz",p:32.60,sf:57.78,dim:"130x64"},
  {n:"Venus",c:"Quartz",p:32.60,sf:75.16,dim:"137x79"},
  // ─── GROUP 6 — $39.50/sf ───
  {n:"Aceno Beach / Ijen Azul (126x63)",c:"Quartz",p:39.50,sf:55.13,dim:"126x63"},
  {n:"Aceno Beach / Ijen Azul (128x65)",c:"Quartz",p:39.50,sf:57.78,dim:"128x65"},
  {n:"Costa Bella",c:"Quartz",p:39.50,sf:55.13,dim:"126x63"},
  {n:"Malana (126x63)",c:"Quartz",p:39.50,sf:55.13,dim:"126x63"},
  {n:"Malana (130x65)",c:"Quartz",p:39.50,sf:58.68,dim:"130x65"},
  {n:"Revelry Storm / Sono Reale",c:"Quartz",p:39.50,sf:55.13,dim:"126x63"},
  // ─── GROUP 7 — $40.95/sf ───
  {n:"Illennia / Lumen Sky",c:"Quartz",p:40.95,sf:55.13,dim:"126x63"},
  {n:"Revelry Macchia / Sono Soleil",c:"Quartz",p:40.95,sf:55.13,dim:"126x63"},
];

// ─────────────────────────────────────────────────────────────────────────────
// MSI  — Colorado (CODE), Published January 2026
// 3cm only. Prices = LOOSE per SF (single slab).
// NOTE: Slab sizes vary by color within each group. The size shown is a typical
// average for the group — actual size depends on the specific color chosen.
// ─────────────────────────────────────────────────────────────────────────────
const MSI_NOTE = "MSI slab sizes vary by color within each group. The dimensions shown are a typical average for this price group — the actual slab you order may differ. Call the vendor to confirm exact dimensions for the specific color you're quoting.";

const MSI = [
  {n:"Group 0 - 3cm",c:"Quartz",p:11.95,sf:76,dim:"~138x79",est:true,note:MSI_NOTE},
  {n:"Group 1 - 3cm",c:"Quartz",p:13.50,sf:76,dim:"~138x79",est:true,note:MSI_NOTE},
  {n:"Group 2 - 3cm",c:"Quartz",p:16.75,sf:76,dim:"~138x79",est:true,note:MSI_NOTE},
  {n:"Group 3 - 3cm",c:"Quartz",p:19.95,sf:76,dim:"~138x79",est:true,note:MSI_NOTE},
  {n:"Group 4 - 3cm",c:"Quartz",p:21.95,sf:76,dim:"~138x79",est:true,note:MSI_NOTE},
  {n:"Group 5 - 3cm",c:"Quartz",p:24.50,sf:59,dim:"~130x65",est:true,note:MSI_NOTE},
  {n:"Group 6 - 3cm",c:"Quartz",p:29.50,sf:56,dim:"~127x64",est:true,note:MSI_NOTE},
  {n:"Group 7 - 3cm",c:"Quartz",p:33.85,sf:55,dim:"~126x63",est:true,note:MSI_NOTE},
  {n:"Group 8 - 3cm",c:"Quartz",p:35.50,sf:55,dim:"~126x63",est:true,note:MSI_NOTE},
  {n:"Group 9 - 3cm",c:"Quartz",p:37.50,sf:55,dim:"~126x63",est:true,note:MSI_NOTE},
];

// ─────────────────────────────────────────────────────────────────────────────
// HANSTONE QUARTZ  — Denver, January 15, 2026 (L2 pricing)
// 3cm only. HanStone's price list gives TOTAL SLAB PRICES, not per-SF.
// Per-SF here is calculated using a standard 61x126" slab (53.38 sf).
// Actual dimensions vary by color — call to confirm before finalizing a quote.
// ─────────────────────────────────────────────────────────────────────────────
const HANSTONE_NOTE = "HanStone's price list gives a total per-slab price, not a per-SF rate. The $/SF shown here was calculated using a standard 61×126\" slab (53.38 sf). Actual slab dimensions vary by color — call the vendor to confirm exact size before finalizing this quote.";

const HANSTONE = [
  {n:"Group A - 3cm",c:"Quartz",p:16.72,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group A1 - 3cm",c:"Quartz",p:18.39,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group B - 3cm",c:"Quartz",p:20.95,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group B1 - 3cm",c:"Quartz",p:22.94,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group B2 - 3cm",c:"Quartz",p:23.13,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group B3 - 3cm",c:"Quartz",p:25.35,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group C - 3cm",c:"Quartz",p:26.84,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group C1 - 3cm",c:"Quartz",p:29.42,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group D - 3cm",c:"Quartz",p:29.22,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group D1 - 3cm",c:"Quartz",p:32.04,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
  {n:"Group E - 3cm",c:"Quartz",p:40.04,sf:53.38,dim:"~61x126",est:true,note:HANSTONE_NOTE},
];

// ─────────────────────────────────────────────────────────────────────────────
// GRANITE IMPORTS  — Denver, January 2026
// Natural stone — slab sizes genuinely vary per lot.
// ─────────────────────────────────────────────────────────────────────────────
const GI_NOTE = "Natural stone slab sizes vary by lot and origin. The ~55 sf figure is a typical industry estimate — actual dimensions depend on which slab you pull from inventory. Call the vendor to confirm the exact size before finalizing your quote.";

const GRANITE_IMPORTS = [
  {n:"Caledonia",c:"Granite",p:8.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Santa Cecilia Light",c:"Granite",p:9.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Uba Tuba",c:"Granite",p:9.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Valle Nevado",c:"Granite",p:11.95,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Jet Mist (SALE)",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Santa Cecilia",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Uba Tuba (L/P dual)",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blizzard (SALE)",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Surf Green (SALE)",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Bianco Santa Cecilia",c:"Granite",p:13.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Black Pearl",c:"Granite",p:13.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Giallo Ornamental",c:"Granite",p:13.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"White G (L/P dual)",c:"Granite",p:14.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Silver Cloud",c:"Granite",p:15.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Black Pearl (L/P dual)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Bianco Tropical (L/P dual)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Giallo Ornamental (L/P/S)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Luna Pearl",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Sandstorm (L/P dual)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Silver Cloud (L/P dual)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Silver Pearl (L/P dual)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Sucuri Brown (SALE)",c:"Granite",p:16.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Uba Tuba (L)",c:"Granite",p:12.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Negresco (L/H dual)",c:"Granite",p:16.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Sierra River (L/P dual)",c:"Granite",p:18.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Bianco Romano (L/P dual)",c:"Granite",p:19.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Smokey Mountain",c:"Granite",p:19.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Fantasy (C/P dual)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Flower",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Colonial Cream",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Desert Beach",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Legacy White",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Maori (P & L)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Millenium Cream",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Normandy",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Ocean Fantasy",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Python Black (P & L)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Red Verona (L/P dual)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"River White",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Supreme Black (P & L)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Via Lactea",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Vincent Black (L/H dual)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"White Ice",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"White Persa (L/P dual)",c:"Granite",p:20.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Verde Maritaka",c:"Granite",p:17.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"White Spring (P/C/S)",c:"Granite",p:17.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Ganashe",c:"Granite",p:21.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Bianco Antico Extra",c:"Granite",p:22.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Caravelas",c:"Granite",p:22.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Golden Thunder (P & L)",c:"Granite",p:22.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"White Ice (L)",c:"Granite",p:22.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Black Amber",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Pearl",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Colonial Cream Extra",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Crema Bordeaux",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Golden Sage",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Ivory Silk",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Persian Pearl",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"River White Extra",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Sienna Beige",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Snowstorm (P & L)",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Tidal White (L/P dual)",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Typhoon Bordeaux",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Flower (L)",c:"Granite",p:21.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Ocean Fantasy (L/P dual)",c:"Granite",p:22.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Emerald Forest",c:"Granite",p:28.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Gold Marinace",c:"Granite",p:28.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Magma Gold",c:"Granite",p:28.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Absolute Black (L/P dual)",c:"Granite",p:24.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Araras Gold",c:"Granite",p:27.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Austral Sage",c:"Granite",p:28.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Golden Sage (L/P dual)",c:"Granite",p:28.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Cygnus",c:"Granite",p:28.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Black Forest",c:"Granite",p:30.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Verde Fuoco (L)",c:"Granite",p:29.80,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Golden Fantasy",c:"Granite",p:29.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Saturnia Gold",c:"Granite",p:29.50,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Sedna",c:"Granite",p:31.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Anthracite NEW",c:"Granite",p:32.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Azul Cafe",c:"Granite",p:32.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Black Taurus",c:"Granite",p:32.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Supernova NEW",c:"Granite",p:32.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Verde Fuoco (P & L)",c:"Granite",p:32.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Atlas",c:"Granite",p:38.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Azul Cafe Extra",c:"Granite",p:38.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Azul Cafe Extra (L/P dual)",c:"Granite",p:40.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Anthracite Deep Tech NEW",c:"Granite",p:40.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Everest White Extra (C)",c:"Granite",p:40.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Eagle",c:"Granite",p:79.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Bahia",c:"Granite",p:107.90,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
  {n:"Blue Bahia Extra",c:"Granite",p:120.00,sf:55.0,dim:"~115x69",est:true,note:GI_NOTE},
];

// ─────────────────────────────────────────────────────────────────────────────
// WILSONART / METRO  — Denver, 2025 Pricing
// 3cm only. Exact slab sizes from price card spreadsheet.
// Per-SF sell prices computed at L1 Denver margin (35%).
// ─────────────────────────────────────────────────────────────────────────────
const WILSONART = [
  {n:"Group 1 - 3cm",c:"Quartz",p:27.66,sf:53.38,dim:"61x126"},
  {n:"Group 2 - 3cm",c:"Quartz",p:31.97,sf:53.38,dim:"61x126"},
  {n:"Group 3 - 3cm",c:"Quartz",p:36.94,sf:53.38,dim:"61x126"},
  {n:"Group 4 - 3cm",c:"Quartz",p:42.85,sf:53.38,dim:"61x126"},
  {n:"Group 5 - 3cm",c:"Quartz",p:52.48,sf:53.38,dim:"61x126"},
];

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR MAP
// ─────────────────────────────────────────────────────────────────────────────
const VENDORS = {
  "Arizona Tile": AZ_TILE,
  "Caesarstone": CAESARSTONE,
  "Cambria": CAMBRIA,
  "StratusQuartz": STRATUS_QUARTZ,
  "PentalQuartz": PENTAL,
  "MSI": MSI,
  "HanStone": HANSTONE,
  "Granite Imports": GRANITE_IMPORTS,
  "Wilsonart / Metro": WILSONART,
};

// Flat list of every item tagged with its vendor name — used for "All Vendors" search
const ALL_ITEMS = Object.entries(VENDORS).flatMap(([vName, list]) =>
  list.map(item => ({ ...item, vendor: vName }))
);

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
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedEst, setSelectedEst] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const [fabRate, setFabRate] = useState(String(DEF_FAB));
  const [instRate, setInstRate] = useState(String(DEF_INST));

  const [hasCutouts, setHasCutouts] = useState(false);
  const [cutoutDesc, setCutoutDesc] = useState("");
  const [cutoutQty, setCutoutQty] = useState("");
  const [cutoutPrice, setCutoutPrice] = useState("200");

  const [addons, setAddons] = useState([
    { id: 1, name: "Mitring (sq ft)", qty: "0", price: "60", locked: true },
  ]);

  const [discounts, setDiscounts] = useState([]);

  const [vendor, setVendor] = useState("All Vendors");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showLookup, setShowLookup] = useState(false);

  const area = parseFloat(sqft) || 0;
  const matPrice = parseFloat(materialPrice) || 0;
  const slabSize = parseFloat(slabSf) || 0;
  const multiplier = materialOptions[material].multiplier;
  const fab = parseFloat(fabRate) || 0;
  const inst = parseFloat(instRate) || 0;
  const coQty = parseInt(cutoutQty) || 0;
  const coPrice = parseFloat(cutoutPrice) || 0;

  const materialTotal = matPrice * area * multiplier;
  const fabrication = area * fab;
  const installation = area * inst;
  const cutoutTotal = hasCutouts ? coQty * coPrice : 0;
  const addonsTotal = addons.reduce((s, a) => s + ((parseFloat(a.qty) || 0) * (parseFloat(a.price) || 0)), 0);
  const subtotal = materialTotal + fabrication + installation + cutoutTotal + addonsTotal;

  const discountsTotal = discounts.reduce((s, d) => {
    const v = parseFloat(d.value) || 0;
    return s + (d.type === "%" ? subtotal * (v / 100) : v);
  }, 0);
  const total = Math.max(0, subtotal - discountsTotal);

  const slabCount = slabSize > 0 && area > 0 ? Math.ceil(area / slabSize) : 0;
  const totalSlabSf = slabCount * slabSize;
  const lastSlabUsed = slabCount > 0 ? area - (slabCount - 1) * slabSize : 0;
  const lastSlabPct = slabSize > 0 ? (lastSlabUsed / slabSize) * 100 : 0;

  const vendorContact = selectedVendor ? VENDOR_INFO[selectedVendor] : null;

  const isAllVendors = vendor === "All Vendors";
  const items = isAllVendors ? ALL_ITEMS : (VENDORS[vendor] || []);
  const categories = useMemo(() => ["All", ...[...new Set(items.map(i => i.c))].sort()], [vendor]);
  const filtered = useMemo(() => {
    let list = items;
    if (catFilter !== "All") list = list.filter(i => i.c === catFilter);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(i => i.n.toLowerCase().includes(q) || (i.vendor || "").toLowerCase().includes(q)); }
    return list;
  }, [items, catFilter, search]);

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

          <Field label="Slab Size (sq ft per slab)">
            <input type="number" min="0" value={slabSf} onChange={e => { setSlabSf(e.target.value); setSlabDim(""); setSelectedEst(false); setSelectedNote(""); }} placeholder="e.g. 53.38" className={inp} />
            {slabDim && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-gray-400">Slab dimensions:</span>
                <span className={`text-xs font-medium ${slabDim.startsWith("~") ? "text-yellow-400" : "text-blue-400"}`}>
                  {slabDim}"
                </span>
              </div>
            )}
          </Field>

          {/* ── PRICE SOURCE & VENDOR CONTACT — always shown when a material is selected ── */}
          {selectedName && vendorContact && (() => {
            const src = vendorContact.src;
            const isVerified = (src === "both" || src === "psf") && !selectedEst;
            const borderCls  = isVerified ? "border-green-700"  : "border-amber-600";
            const bgCls      = isVerified ? "bg-green-950"      : "bg-amber-950";
            const headCls    = isVerified ? "text-green-300"     : "text-amber-300";
            const textCls    = isVerified ? "text-green-200"     : "text-amber-200";
            const dividerCls = isVerified ? "border-green-800"   : "border-amber-700";
            const iconCls    = isVerified ? "text-green-400"     : "text-amber-400";
            const contactHdCls = isVerified ? "text-green-300"  : "text-amber-300";
            const contactTxtCls = isVerified ? "text-green-200" : "text-amber-200";

            const icon   = isVerified ? "✓" : "⚠️";
            const headLabel = isVerified
              ? (src === "both"
                  ? "Price Verified — Vendor provided $/SF and slab price"
                  : "Price Verified — Vendor provided $/SF directly")
              : (src === "slab_calc"
                  ? "Price Calculated — Vendor provided slab price only"
                  : src === "margin_calc"
                  ? "Price Calculated — Derived from internal cost sheet"
                  : "Slab Size Estimated — Verify before finalizing");

            return (
              <div className={`rounded-lg border ${borderCls} ${bgCls} p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <span className={`text-base ${iconCls}`}>{icon}</span>
                  <span className={`text-sm font-semibold ${headCls}`}>{headLabel}</span>
                </div>
                <p className={`text-xs leading-relaxed ${textCls}`}>{vendorContact.srcMsg}</p>
                {selectedEst && selectedNote && (
                  <p className={`text-xs leading-relaxed ${textCls} pt-1`}>{selectedNote}</p>
                )}
                <div className={`pt-2 mt-1 border-t ${dividerCls} space-y-0.5`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${iconCls}`}>📞</span>
                    <span className={`text-xs font-semibold ${contactHdCls}`}>{vendorContact.name}</span>
                  </div>
                  <div className={`text-xs pl-5 ${contactTxtCls}`}>{vendorContact.phone}</div>
                  <div className={`text-xs pl-5 ${contactTxtCls}`}>{vendorContact.address}</div>
                </div>
              </div>
            );
          })()}
        </Section>

        {/* ── LOOKUP ── */}
        {showLookup && (
          <div className="bg-gray-900 rounded-xl p-5 border border-blue-800 space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Find Material Price</h2>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vendor</label>
              <select value={vendor} onChange={e => { setVendor(e.target.value); setCatFilter("All"); setSearch(""); }} className={inpSm}>
                <option value="All Vendors">— All Vendors —</option>
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
              <label className="block text-xs font-medium text-gray-400 mb-1">Search by name{isAllVendors ? " or vendor" : ""}</label>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={isAllVendors ? "e.g. Calacatta, Cambria, Group 3..." : "e.g. Calacatta, Group 3..."} className={inpSm} />
            </div>
            <div className="text-xs text-gray-500">{filtered.length} item{filtered.length !== 1 ? "s" : ""}{isAllVendors ? " across all vendors" : ""}</div>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 && <div className="text-gray-500 text-sm py-4 text-center">No materials found</div>}
              {filtered.map((item, i) => {
                const itemVendor = item.vendor || vendor;
                return (
                  <button key={i} onClick={() => {
                    setMaterialPrice(String(item.p));
                    setSlabSf(String(item.sf));
                    setSlabDim(item.dim || "");
                    setSelectedName(item.n);
                    setSelectedVendor(itemVendor);
                    setSelectedEst(!!item.est);
                    setSelectedNote(item.note || "");
                    setShowLookup(false);
                  }}
                    className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-left transition-all ${item.est
                      ? "bg-amber-950 border-amber-700 hover:border-amber-500"
                      : "bg-gray-800 border-gray-700 hover:border-blue-600"}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-white font-medium truncate">{item.n}</span>
                        {item.est && <span className="text-xs text-amber-400 flex-shrink-0">⚠ est.</span>}
                      </div>
                      <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
                        {isAllVendors && <span className="text-blue-400 font-medium">{itemVendor}</span>}
                        <span>{item.c}</span>
                        <span className={`${item.est ? "text-amber-500" : "text-gray-500"}`}>{item.sf} sf</span>
                        <span className={`${item.est ? "text-amber-500" : "text-gray-500"}`}>{item.dim}"</span>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <div className="text-sm font-bold text-green-400">${item.p.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">per sf</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-amber-500 flex items-center gap-1">
              <span>⚠</span><span>est. = slab size is estimated — call vendor to confirm</span>
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

        {/* ── ADDITIONAL COSTS ── */}
        <Section title="Additional Costs">
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
            {selectedName && (
              <div className="mb-2">
                <div className="text-xs text-blue-400">Material: {selectedName}</div>
                {selectedVendor && <div className="text-xs text-gray-500">Vendor: {selectedVendor}</div>}
              </div>
            )}
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
