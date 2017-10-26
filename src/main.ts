import * as _ from 'lodash';

interface Solution {
    guess: Guess
    mapping: any
}

class Guess {
    private sum: number[]
    private answer: number

    private constructor() {
        this.sum = [];
        this.answer = 0;
    }

    static build(words: string[], mapping: any, answerChars: string[]): Guess {
        const guess = new Guess();
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordChars = word.split('');
            let num = '';
            wordChars.forEach((char) => {
                num += mapping[char];
            });
            if (num.split('')[0] === '0') {
                return null;
            }
            guess.sum.push(_.toNumber(num));
        }
        let answerNum = '';
        answerChars.forEach((char) => {
            answerNum += mapping[char];
        });
        if (answerNum.split('')[0] === '0') {
            return null;
        }
        guess.answer = _.toNumber(answerNum);
        return guess;
    }

    foundAnswer(): boolean {
        const guess = _.sum(this.sum);
        return guess === this.answer;
    }
}

class CryptarithmeticSolver {

    private words: string[];
    private answer: string;
    private allChars: string[];
    private answerChars: string[];

    constructor(words: string[], answer: string) {
        this.words = words;
        this.answer = answer;
        this.answerChars = this.answer.split('');
        this.allChars = _.uniq(_.flatMap(this.words, (word: string) => word.split('')).concat(this.answerChars));
    }

    calculate(): Solution {
        let answerFound = false;
        const solution: Solution = {
            guess: null,
            mapping: [],
        };
        while (!answerFound) {
            solution.mapping = this.makeMapping();
            solution.guess = Guess.build(
                this.words,
                solution.mapping,
                this.answerChars,
            );
            if (!solution.guess) {
                continue;
            }
            answerFound = solution.guess.foundAnswer();
        }
        return solution;
    }

    private makeMapping(): any {
        const shuffled = _.shuffle(this.allChars);
        const mapping: any = {};
        shuffled.forEach((char) => {
            let num = _.random(0, 9);
            while (this.mappingContains(mapping, num)) {
                num = _.random(0, 9);
            }
            mapping[char] = num;
        });
        return mapping;
    }

    private mappingContains(mapping: any, num: number): boolean {
        const keys = _.keys(mapping);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (mapping[key] === num) {
                return true;
            }
        }
        return false;
    }
}

const words = ['eight', 'three', 'nine'];
const answer = 'twenty';

const solver = new CryptarithmeticSolver(words, answer);
console.log(solver.calculate());