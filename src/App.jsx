import { useState } from "react";

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

  const area = parseFloat(sqft) || 0;
  const mitreArea = parseFloat(mitreSqft) || 0;
  const matPrice = parseFloat(materialPrice) || 0;
  const multiplier = materialOptions[material].multiplier;

  const materialTotal = matPrice * area * multiplier;
  const fabrication = area * FAB_RATE;
  const installation = area * INSTALL_RATE;
  const mitring = mitreArea * MITRE_RATE;
  const total = materialTotal + fabrication + installation + mitring;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-1">Price Estimate</h1>
        <p className="text-gray-400 text-sm mb-6">Enter project details to generate a customer quote.</p>

        <div className="bg-gray-900 rounded-xl p-5 space-y-5 border border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Total Project Area (sq ft)
            </label>
            <input
              type="number"
              min="0"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Material Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {materialOptions.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => setMaterial(i)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                    material === i
                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                      : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {opt.label}
                  <span className="block text-xs mt-0.5 opacity-70">
                    x{opt.multiplier.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Material Price ($ per sq ft)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                value={materialPrice}
                onChange={(e) => setMaterialPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Mitring Area (sq ft)
            </label>
            <input
              type="number"
              min="0"
              value={mitreSqft}
              onChange={(e) => setMitreSqft(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 mt-4 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Cost Breakdown
          </h2>
          <div className="space-y-2.5 text-sm">
            <Row
              label={`Material (${fmt(matPrice)}/sqft x ${area} sqft x ${multiplier.toFixed(2)})`}
              value={materialTotal}
              bold
            />
            <Row label={`Fabrication (${area} sq ft x $${FAB_RATE})`} value={fabrication} />
            <Row label={`Installation (${area} sq ft x $${INSTALL_RATE})`} value={installation} />
            <Row label={`Mitring (${mitreArea} sq ft x $${MITRE_RATE})`} value={mitring} />
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
