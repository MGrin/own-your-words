import { keccak_256 } from "js-sha3";
import uts46 from "idna-uts46-hx";

export function namehash(inputName) {
  // Reject empty names:
  let node = "";
  for (let i = 0; i < 32; i++) {
    node += "00";
  }

  let name = normalize(inputName);

  if (name) {
    let labels = name.split(".");

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha = keccak_256(labels[i]);
      node = keccak_256(new Buffer(node + labelSha, "hex"));
    }
  }

  return "0x" + node;
}

export function normalize(name) {
  return name
    ? uts46.toAscii(name, { useStd3ASCII: true, transitional: false })
    : name;
}
