export interface BBSResult {
  sequence: number[];
  bits: string;
  n: number;
  initialSeed: number;
}

function gcd(a: number, b: number): number {
  //algoritmo de euclides
  // https://pt.wikipedia.org/wiki/Algoritmo_de_Euclides
  while (b !== 0) {
    const rest = a % b;
    a = b;
    b = rest;
  }
  return a;
}

function areCoprimes(a: number, b: number): boolean {
  return gcd(a, b) === 1;
}

function findCoprimeSeed(n: number): number {
  //procura um número aleatório entre 2 e n-1 que seja coprimo com n
  let coprime: number;
  do {
    coprime = Math.floor(Math.random() * (n - 2)) + 2;
  } while (!areCoprimes(coprime, n));
  return coprime;
}

const blumBlumShub = (p: number, q: number, sequenceLength: number) => {
  if (p % 4 !== 3 || q % 4 !== 3) {
    throw new Error("p e q devem ser congruentes a 3 módulo 4");
  }

  const n = p * q;
  let s = findCoprimeSeed(n);

  const sequence: number[] = [];
  const bits: string[] = [];

  for (let i = 0; i < sequenceLength; i++) {
    s = (s * s) % n;
    sequence.push(s);
    bits.push((s & 1).toString());
  }

  return {
    sequence,
    bits: bits.join(""),
    n,
    initialSeed: findCoprimeSeed(n),
  };
};

export default blumBlumShub;
