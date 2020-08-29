import { entropyToMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { addHexPrefix, privateToAddress } from 'ethereumjs-util';
import crypto from 'crypto';
import assert from 'assert';

export class EtcAddress {

    static generateMnemonic() {
        return entropyToMnemonic(crypto.randomBytes(16));
    }
    constructor(mnemonic, index = 0) {
        assert(mnemonic,'Missing 1st argument mnemonic, run Address.generateMnemonic() to generate');
        assert(validateMnemonic(mnemonic),'Invalid mnemonic seed.');
        this.currentIndex = index;
        this.mnemonic = mnemonic;
        this._generateHdNode();
    }
    _generateHdNode() {
        const seed = mnemonicToSeedSync(this.mnemonic);
        this.node = fromSeed(seed);
    }
    createAddress() {
      this.currentIndex++;
      const {address, index} = this.getAddressInfo(this.currentIndex);
      return {index,address};
    }
    get masterInfo() {
      return {mnemonic: this.mnemonic, ...this.getAddressInfo(0)}
    }
    get master(){
      return this.getAddress(0);
    }
    getAddress(index) {
      index = parseInt(index);
      return this.getAddressInfo(index).address;
    }
    getAddressInfo(index) {
        index = parseInt(index);
        const child = this.node.derivePath(`m/44'/61'/${ index }'/0/0`);
        const privateKey = child.privateKey;
        const address = privateToAddress(privateKey);
        return {
            index,
            privateKey: addHexPrefix(privateKey.toString("hex")),
            address: addHexPrefix(address.toString("hex"))
        };
    }
}