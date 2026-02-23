import { useState, useMemo } from "react";

// ── Arizona Tile Price Data (3CM / SF price, Full Release & In House only) ──
const AZ_TILE = [
  // ─── NATURAL STONE: GRANITE ───
  {n:"Atacama",c:"Granite",p:21.14,s:"Full Release"},
  {n:"Atlantico",c:"Granite",p:10.29,s:"Full Release"},
  {n:"Avocatus Satin",c:"Granite",p:55.04,s:"Full Release"},
  {n:"Barcelona",c:"Granite",p:10.04,s:"Full Release"},
  {n:"Belvedere Satin",c:"Granite",p:50.16,s:"Full Release"},
  {n:"Bianco Typhoon Satin",c:"Granite",p:15.95,s:"Full Release"},
  {n:"Bianco Typhoon",c:"Granite",p:15.95,s:"Full Release"},
  {n:"Black Mist Honed",c:"Granite",p:17.75,s:"Full Release"},
  {n:"Black Pearl Satin",c:"Granite",p:17.53,s:"Full Release"},
  {n:"Black Pearl",c:"Granite",p:17.59,s:"Full Release"},
  {n:"Bliss",c:"Granite",p:11.44,s:"Full Release"},
  {n:"Blizzard",c:"Granite",p:18.58,s:"Full Release"},
  {n:"Bluzonite",c:"Granite",p:27.72,s:"Full Release"},
  {n:"Carbon Grey Satin",c:"Granite",p:38.39,s:"Full Release"},
  {n:"Colonial White",c:"Granite",p:21.59,s:"Full Release"},
  {n:"Dallas White",c:"Granite",p:11.36,s:"Full Release"},
  {n:"Delicatus White",c:"Granite",p:26.61,s:"Full Release"},
  {n:"Desert Canyon",c:"Granite",p:51.65,s:"Full Release"},
  {n:"Indian Premium Black Honed",c:"Granite",p:33.70,s:"Full Release"},
  {n:"Indian Premium Black Satin",c:"Granite",p:33.70,s:"Full Release"},
  {n:"Indian Premium Black",c:"Granite",p:33.70,s:"Full Release"},
  {n:"Kalahari",c:"Granite",p:20.37,s:"Full Release"},
  {n:"Kashmire Cream",c:"Granite",p:26.40,s:"Full Release"},
  {n:"Monte Cristo Satin",c:"Granite",p:24.09,s:"Full Release"},
  {n:"Monte Cristo",c:"Granite",p:24.11,s:"Full Release"},
  {n:"Negresco Satin",c:"Granite",p:37.61,s:"Full Release"},
  {n:"New Caledonia",c:"Granite",p:11.38,s:"Full Release"},
  {n:"New Romano Satin",c:"Granite",p:18.31,s:"Full Release"},
  {n:"New Romano",c:"Granite",p:18.31,s:"Full Release"},
  {n:"New Valle Nevado",c:"Granite",p:11.36,s:"Full Release"},
  {n:"Silver Cloud Satin",c:"Granite",p:16.89,s:"Full Release"},
  {n:"Silver Falls",c:"Granite",p:15.90,s:"Full Release"},
  {n:"Snowridge",c:"Granite",p:15.36,s:"Full Release"},
  {n:"St Cecilia Light",c:"Granite",p:12.02,s:"Full Release"},
  {n:"St Cecilia White",c:"Granite",p:11.03,s:"Full Release"},
  {n:"Steel Grey Satin",c:"Granite",p:17.54,s:"Full Release"},
  {n:"Steel Grey",c:"Granite",p:17.62,s:"Full Release"},
  {n:"Titanium",c:"Granite",p:28.88,s:"Full Release"},
  {n:"Typhoon Bordeaux",c:"Granite",p:38.39,s:"Full Release"},
  {n:"Verde Ubatuba",c:"Granite",p:11.80,s:"Full Release"},
  {n:"Viridian",c:"Granite",p:57.91,s:"Full Release"},
  {n:"Viscount White",c:"Granite",p:16.63,s:"Full Release"},
  {n:"Volcano",c:"Granite",p:37.16,s:"In House"},
  {n:"Whisper White",c:"Granite",p:20.34,s:"Full Release"},
  // ─── NATURAL STONE: MARBLE & DOLOMITE ───
  {n:"Bianco Carrara Honed",c:"Marble",p:26.65,s:"Full Release"},
  {n:"Bianco Carrara",c:"Marble",p:26.65,s:"Full Release"},
  {n:"Calacatta Umber Honed",c:"Marble",p:51.03,s:"Full Release"},
  {n:"Fantasy Black Satin",c:"Marble & Dolomite",p:26.98,s:"In House"},
  {n:"Fantasy Blue Satin",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Fantasy Brown Satin",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Fantasy Brown",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Fantasy Ocean Satin",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Fantasy Statuary Satin",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Fantasy Zebra Satin",c:"Marble & Dolomite",p:26.98,s:"Full Release"},
  {n:"Opal White Satin",c:"Marble",p:31.64,s:"Full Release"},
  {n:"Opal White",c:"Marble",p:31.64,s:"Full Release"},
  // ─── NATURAL STONE: LIMESTONE ───
  // (No 3CM items available)
  // ─── NATURAL STONE: QUARTZITE ───
  {n:"Aqua Venato",c:"Quartzite",p:40.95,s:"Full Release"},
  {n:"Artemis",c:"Quartzite",p:46.90,s:"Full Release"},
  {n:"Azzurra Bay",c:"Quartzite",p:42.79,s:"Full Release"},
  {n:"Bella",c:"Quartzite",p:50.16,s:"Full Release"},
  {n:"Blue Tahoe Satin",c:"Quartzite",p:43.58,s:"Full Release"},
  {n:"Blue Tahoe",c:"Quartzite",p:43.58,s:"Full Release"},
  {n:"Calacatta Quartzite",c:"Quartzite",p:43.57,s:"Full Release"},
  {n:"Calacatta Taupe",c:"Quartzite",p:32.49,s:"Full Release"},
  {n:"Dakar",c:"Quartzite",p:39.85,s:"Full Release"},
  {n:"Ebon",c:"Quartzite",p:67.18,s:"Full Release"},
  {n:"Ijen Blue Satin",c:"Quartzite",p:57.49,s:"Full Release"},
  {n:"Ijen Blue",c:"Quartzite",p:57.49,s:"Full Release"},
  {n:"Lavezzi",c:"Quartzite",p:45.74,s:"Full Release"},
  {n:"Mojave Satin",c:"Quartzite",p:41.36,s:"Full Release"},
  {n:"Mont Blanc Satin",c:"Quartzite",p:51.60,s:"Full Release"},
  {n:"Mont Blanc",c:"Quartzite",p:51.61,s:"Full Release"},
  {n:"Mustang",c:"Quartzite",p:39.85,s:"Full Release"},
  {n:"New Louise Blue",c:"Quartzite",p:79.14,s:"In House"},
  {n:"Nickel",c:"Quartzite",p:40.38,s:"Full Release"},
  {n:"Nuage",c:"Quartzite",p:47.43,s:"Full Release"},
  {n:"Paramount",c:"Quartzite",p:132.48,s:"Full Release"},
  {n:"Perlato Taj",c:"Quartzite",p:44.97,s:"Full Release"},
  {n:"Polaris",c:"Quartzite",p:55.65,s:"Full Release"},
  {n:"Taj Mahal Satin",c:"Quartzite",p:64.99,s:"Full Release"},
  {n:"Taj Mahal",c:"Quartzite",p:64.99,s:"Full Release"},
  {n:"Utopia",c:"Quartzite",p:49.17,s:"In House"},
  {n:"White Lux",c:"Quartzite",p:53.62,s:"Full Release"},
  {n:"White Pearl",c:"Quartzite",p:42.80,s:"Full Release"},
  // ─── NATURAL STONE: TRAVERTINE ───
  {n:"Torreon Stone",c:"Travertine",p:26.39,s:"Full Release"},
  // ─── DELLA TERRA QUARTZ (3CM / SF) ───
  {n:"Frost-N",c:"Quartz",p:14.44,s:"Full Release"},
  {n:"Gemstone Beige-N",c:"Quartz",p:14.44,s:"Full Release"},
  {n:"Oceana-N",c:"Quartz",p:14.44,s:"Full Release"},
  {n:"White Sand-N",c:"Quartz",p:14.44,s:"Full Release"},
  {n:"Zinc",c:"Quartz",p:14.44,s:"Full Release"},
  {n:"Aerial",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Bianco Tiza",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Carrara Breeze",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Cotton",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Crest",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Crisp Stria",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Dusk-N",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Linen-N",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Tawny",c:"Quartz",p:16.50,s:"Full Release"},
  {n:"Biancone",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Denali-N",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Fog",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Oxide Honed",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Oxide",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Pro Cloud",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Pro Frost",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Pro Storm",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Slate Grey-N",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Willow",c:"Quartz",p:20.17,s:"Full Release"},
  {n:"Altais White",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Aviana",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Bianco Pearl",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Calacatta Alba",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Calacatta Divine",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Carrara Barolo",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"New Venatino Beige",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"New Venatino Grey",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Pencil Vein",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Ridge",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Serene",c:"Quartz",p:22.16,s:"Full Release"},
  {n:"Bianco Levanto",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Calacatta Bellatrix",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Calacatta Capella",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Calacatta Jubilee",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Calacatta Maywood",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Concrete Grey Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Concrete Grey",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Desert Pearl",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Haku White Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Haku White",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Hana Sky",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Ivory White Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Ivory White",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Pilar",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Portofino Classic Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Portofino Classic",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Ripieno Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Ripieno",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Sonata Honed",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Sonata",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Valbella Gold",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Valbella Grey",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Vena",c:"Quartz",p:25.70,s:"Full Release"},
  {n:"Arabescato Como",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Calacatta Doria",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Citrine",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Firenze",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Grigio Elegante Honed",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Grigio Elegante",c:"Quartz",p:28.48,s:"Full Release"},
  {n:"Bertoli",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"Cortona Gold",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"Metropolis Dark",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"New Taj",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"Vallejo Gold",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"Vallejo Grey",c:"Quartz",p:29.10,s:"Full Release"},
  {n:"Maxim",c:"Quartz",p:41.60,s:"Full Release"},
  {n:"Montreal",c:"Quartz",p:41.60,s:"Full Release"},
  {n:"Silver Stallion",c:"Quartz",p:41.60,s:"Full Release"},
  {n:"Zuri",c:"Quartz",p:41.60,s:"Full Release"},
  // ─── DELLA TERRA PORCELAIN (12mm / SF) ───
  {n:"Arabescato Viola A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Arabescato Viola B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Bianco Namibia A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Bianco Namibia B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Bianco Namibia A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Bianco Namibia B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Blaze Iron (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Calacatta Michelangelo A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Calacatta Michelangelo B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Calacatta Michelangelo A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Calacatta Michelangelo B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Diamond Ivory (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Imperiale Light A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Imperiale Light B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Imperiale Light A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Imperiale Light B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Limestone Greige (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Luna Quartzite A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Luna Quartzite B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Luna Quartzite A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Luna Quartzite B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Extra A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Extra B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Extra A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Extra B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Prestigio A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Prestigio B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Prestigio A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Prestigio B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Apuano A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Apuano B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Calacatta Apuano A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Calacatta Apuano B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Fior Di Bosco A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Fior Di Bosco B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Fior Di Bosco A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Fior Di Bosco B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Black Atlantis A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Black Atlantis B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Marvel Black Atlantis A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Marvel Black Atlantis B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Mont Blanc A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Mont Blanc B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Mont Blanc A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Mont Blanc B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Resin Pearl (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Resin Pepper (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Soapstone Dark (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Statuario Light A (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Statuario Light B (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Statuario Light A (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Statuario Light B (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Taj Mahal (Pol)",c:"Porcelain",p:20.46,s:"Full Release"},
  {n:"Taj Mahal (Soft)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Tran Beige (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Tran Ivory (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Travertino White (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Travertino Honey (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
  {n:"Travertino Bone (Matte)",c:"Porcelain",p:17.82,s:"Full Release"},
];

const VENDORS = { "Arizona Tile": AZ_TILE };

const materialOptions = [
  { label: "Quartz", multiplier: 1.30 },
  { label: "Granite", multiplier: 1.35 },
  { label: "Marble", multiplier: 1.40 },
];

const FAB_RATE = 27;
const INSTALL_RATE = 15;
const MITRE_RATE = 60;

function fmt(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function App() {
  const [sqft, setSqft] = useState("");
  const [material, setMaterial] = useState(0);
  const [materialPrice, setMaterialPrice] = useState("");
  const [mitreSqft, setMitreSqft] = useState("");

  // Lookup state
  const [vendor, setVendor] = useState("Arizona Tile");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showLookup, setShowLookup] = useState(false);

  const area = parseFloat(sqft) || 0;
  const mitreArea = parseFloat(mitreSqft) || 0;
  const matPrice = parseFloat(materialPrice) || 0;
  const multiplier = materialOptions[material].multiplier;

  const materialTotal = matPrice * area * multiplier;
  const fabrication = area * FAB_RATE;
  const installation = area * INSTALL_RATE;
  const mitring = mitreArea * MITRE_RATE;
  const total = materialTotal + fabrication + installation + mitring;

  const items = VENDORS[vendor] || [];
  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.c))].sort();
    return ["All", ...cats];
  }, [vendor]);

  const filtered = useMemo(() => {
    let list = items;
    if (catFilter !== "All") list = list.filter((i) => i.c === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.n.toLowerCase().includes(q));
    }
    return list;
  }, [items, catFilter, search]);

  function usePrice(p) {
    setMaterialPrice(String(p));
    setShowLookup(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-white mb-1">Price Estimate</h1>
        <p className="text-gray-400 text-sm mb-2">Enter project details to generate a customer quote.</p>

        {/* ── CALCULATOR INPUTS ── */}
        <div className="bg-gray-900 rounded-xl p-5 space-y-5 border border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Project Area (sq ft)</label>
            <input type="number" min="0" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Material Type</label>
            <div className="grid grid-cols-3 gap-2">
              {materialOptions.map((opt, i) => (
                <button key={opt.label} onClick={() => setMaterial(i)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${material === i
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500"}`}>
                  {opt.label}
                  <span className="block text-xs mt-0.5 opacity-70">x{opt.multiplier.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Material Price ($ per sq ft)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" min="0" value={materialPrice} onChange={(e) => setMaterialPrice(e.target.value)} placeholder="0.00"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={() => setShowLookup(!showLookup)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${showLookup
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-blue-400 border border-gray-700 hover:border-blue-500"}`}>
                {showLookup ? "Close Lookup" : "Find Price"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mitring Area (sq ft)</label>
            <input type="number" min="0" value={mitreSqft} onChange={(e) => setMitreSqft(e.target.value)} placeholder="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* ── MATERIAL PRICE LOOKUP ── */}
        {showLookup && (
          <div className="bg-gray-900 rounded-xl p-5 border border-blue-800 space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Find Material Price</h2>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vendor</label>
              <select value={vendor} onChange={(e) => { setVendor(e.target.value); setCatFilter("All"); setSearch(""); }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.keys(VENDORS).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Search by Name</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. Calacatta, Taj Mahal..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="text-xs text-gray-500">{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</div>

            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 && <div className="text-gray-500 text-sm py-4 text-center">No materials found</div>}
              {filtered.map((item, i) => (
                <button key={i} onClick={() => usePrice(item.p)}
                  className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-600 rounded-lg px-3 py-2 text-left transition-all group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium truncate">{item.n}</div>
                    <div className="text-xs text-gray-400 flex gap-2">
                      <span>{item.c}</span>
                      <span className={item.s === "In House" ? "text-yellow-400" : "text-green-400"}>{item.s}</span>
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

        {/* ── COST BREAKDOWN ── */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Cost Breakdown</h2>
          <div className="space-y-2.5 text-sm">
            <Row label={`Material (${fmt(matPrice)}/sf x ${area} sf x ${multiplier.toFixed(2)})`} value={materialTotal} bold />
            <Row label={`Fabrication (${area} sf x $${FAB_RATE})`} value={fabrication} />
            <Row label={`Installation (${area} sf x $${INSTALL_RATE})`} value={installation} />
            <Row label={`Mitring (${mitreArea} sf x $${MITRE_RATE})`} value={mitring} />
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

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-white" : "text-gray-300"}`}>
      <span>{label}</span>
      <span>{fmt(value)}</span>
    </div>
  );
}
