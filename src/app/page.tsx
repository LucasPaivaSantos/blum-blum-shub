"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { BarChart3, AlertTriangle, ClipboardCopy } from "lucide-react";
import blumBlumShub, { BBSResult } from "./bbs";
import { Inputs } from "./inputsType";
import analyzeBitFrequency from "./frequencyAnalysis";

const emptyInputs: Inputs = {
  p: 0,
  q: 0,
  sequenceLength: 10,
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputs, setInputs] = useState<Inputs>({
    //números do slide
    p: 383,
    q: 503,
    sequenceLength: 100,
  });

  const [result, setResult] = useState<BBSResult | null>(null);
  const [error, setError] = useState<string>("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
    setError("");
  };

  const validateInputs = () => {
    if (inputs.p <= 0 || inputs.q <= 0) {
      return "p e q devem ser números positivos";
    }
    if (inputs.p % 4 !== 3) {
      return `p = ${inputs.p} deve ser congruente a 3 módulo 4 (p mod 4 = ${
        inputs.p % 4
      })`;
    }
    if (inputs.q % 4 !== 3) {
      return `q = ${inputs.q} deve ser congruente a 3 módulo 4 (q mod 4 = ${
        inputs.q % 4
      })`;
    }
    if (inputs.sequenceLength <= 0 || inputs.sequenceLength > 1000) {
      return "O tamanho da sequência deve estar entre 1 e 1000";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const bbsResult = blumBlumShub(inputs.p, inputs.q, inputs.sequenceLength);
      setResult(bbsResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const bitAnalysis = result ? analyzeBitFrequency(result.bits) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gerador Blum Blum Shub
          </h1>
          <p className="text-gray-600">
            Gerador de números pseudoaleatórios criptograficamente seguro
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="p"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número primo p
                </label>
                <input
                  type="number"
                  name="p"
                  id="p"
                  required
                  min="3"
                  placeholder="Ex: 383"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                  value={inputs.p || ""}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deve ser ≡ 3 (mod 4)
                </p>
              </div>

              <div>
                <label
                  htmlFor="q"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número primo q
                </label>
                <input
                  type="number"
                  name="q"
                  id="q"
                  required
                  min="3"
                  placeholder="Ex: 503"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                  value={inputs.q || ""}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deve ser ≡ 3 (mod 4)
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="sequenceLength"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tamanho da sequência
              </label>
              <input
                type="number"
                name="sequenceLength"
                id="sequenceLength"
                required
                min="1"
                max="1000"
                placeholder="Ex: 100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                value={inputs.sequenceLength || ""}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Quantidade de bits a serem gerados (1-1000)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>Gerar Sequência</>
                )}
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Sequência de Bits Gerada
              </h3>
              <div className="bg-gray-100 rounded-md p-4 mb-4 border-l-4 border-l-indigo-500">
                <p className="font-mono text-sm break-all leading-relaxed tracking-wider">
                  {result.bits}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(result.bits)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" /> Copiar Bits
                </button>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {showAnalysis ? "Ocultar" : "Ver"} Análise
                </button>
              </div>
            </div>

            {showAnalysis && bitAnalysis && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Análise de Frequência dos Bits
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Distribuição de Bits
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Zeros (0)
                          </span>
                          <span className="font-mono text-sm">
                            {bitAnalysis.zeros}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Uns (1)</span>
                          <span className="font-mono text-sm">
                            {bitAnalysis.ones}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-sm text-gray-700">Total</span>
                          <span className="font-mono text-sm">
                            {bitAnalysis.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Percentuais
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Zeros</span>
                            <span>
                              {bitAnalysis.zeroPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{
                                width: `${bitAnalysis.zeroPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uns</span>
                            <span>{bitAnalysis.onePercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${bitAnalysis.onePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
