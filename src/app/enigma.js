const a_start = 65;

class Rotor {
    arr = null;
    machine = null;
    offset = 0;
    constructor(config, turnOver, offset = 0) {
        this.arr = config.split("");
        if (!Number.isInteger(offset)) {
            offset = offset.charCodeAt(0) - a_start;
        }
        if (turnOver) {
            if (!Array.isArray(turnOver)) {
                turnOver = [turnOver];
            }

            this.turnOver = new Set(
                turnOver.map((x) => (x.charCodeAt(0) - a_start) % 26)
            );
        }
        this.offset = offset;
    }

    input2output(idx) {
        let t =
            this.arr[(idx + this.offset) % 26].charCodeAt(0) -
            a_start -
            this.offset;
        if (t < 0) return t + 26;
        return t;
    }

    output2input(idx) {
        let t =
            this.arr.indexOf(
                String.fromCharCode(((idx + this.offset) % 26) + a_start)
            ) - this.offset;
        if (t < 0) return t + 26;
        return t;
    }

    step() {
        this.offset = (this.offset + 1) % 26;
        return this.turnOver.has(this.offset);
    }
}

class Reflector extends Rotor {}

class Machine {
    rotors = [];
    constructor(rotors, reflector) {
        this.rotors = rotors;
        this.rotors.forEach((rotor) => (rotor.machine = this));
        this.reflector = reflector;
    }

    input(char) {
        console.log("========");

        for (let rotor of this.rotors) {
            if (!rotor.step()) {
                break;
            }
        }
        console.log();
        let idx = char.charCodeAt(0) - a_start;
        for (let rotor of this.rotors) {
            idx = rotor.input2output(idx);
            console.log(idx, String.fromCharCode(idx + a_start));
        }
        idx = this.reflector.input2output(idx);
        console.log(idx, String.fromCharCode(idx + a_start));

        for (let rotor of [...this.rotors].reverse()) {
            idx = rotor.output2input(idx);
            console.log(idx, String.fromCharCode(idx + a_start));
        }

        return String.fromCharCode(idx + a_start);
    }

    encrypt(text) {
        return text
            .split("")
            .map((x) => this.input(x))
            .join("");
    }
}

const machine = new Machine(
    [
        // currently there is a bug with z's turn over
        new Rotor("JPGVOUMFYQBENHZRDKASXLICTW", ["M", "Z"], "X"),
        // new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", "Y"),
        new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"),
        new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"),
    ],
    new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL")
);

// machine.input("B");
console.log(machine.encrypt("BBBB"));
