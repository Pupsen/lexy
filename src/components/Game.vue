<template>
    <div class="container" >
        <form onsubmit="return false">
            <div class="row definition well" id="question">
                <span id="question-span">{{sampleString}}</span>
                <span v-if="isCurrentSampleIndexesEmpty" style="color: red">Подсказки закончились</span>
                <b-button variant="light" class="shadow-none" @click="nextSample" v-if="!isTaskSolved" :disabled="isCurrentSampleIndexesEmpty">+</b-button>
                <b-button variant="light" class="shadow-none" @click="showDefinition" v-if="!isTaskSolved && !definition">?</b-button>
            </div>
            <div class="row definition well" v-if="definition">
                {{definition}}
            </div>
            <div class="row definition well" id="answer-row">
                {{metadata[task.wordIndex][0]}} - <b-input v-model="currentAnswer" :disabled="isTaskSolved" />
                <div v-if="isCorrect !== undefined" :style="{color: isCorrect ? 'green' : 'red'}">{{answerReaction}}</div>
            </div>
            <div class="row">
                <b-button variant="primary" class="shadow-none" @click="submitAnswer" v-if="!isTaskSolved" :disabled="isCurrentAnswerEmpty">Проверить</b-button>
                <b-button variant="light" class="shadow-none" @click="giveUp" v-if="!isTaskSolved">Сдаюсь</b-button>
                <b-button variant="primary" class="shadow-none" @click="nextTask" v-if="isTaskSolved">Следующий вопрос</b-button>
            </div>
            <div class="row" id="answer-list">
            </div>
        </form>
    </div>
</template>

<script>
import metadata from '@/metadata.json';

export default {
    name: 'Game',
    data: () => ({
        tasks: [],
        task: {},
        currentSampleIndexes: [],
        sampleString: '',
        definition: '',
        currentAnswer: '',
        answerReaction: '',
        isCorrect: undefined,
        isTaskSolved: false,
        points: 0,
        metadata: metadata.hardCode
    }),
    computed: {
        isCurrentSampleIndexesEmpty() {
            return !this.currentSampleIndexes.length;
        },
        isCurrentAnswerEmpty() {
            return !this.currentAnswer.length;
        }
    },
    created() {
        this.initTasks();
        this.nextTask();
    },
    methods: {
        initTasks() {
            for (let i = 2; i < this.metadata[0].length; i++) {
                const onelf = [];
                let count = 0;

                for (let j = 2; j < this.metadata.length; j++) {
                    if (this.metadata[j][i] !== '') {
                        onelf.push({ lfIndex: i, wordIndex: j });
                        count++;

                        if (!Array.isArray(this.metadata[j][i])) {
                            this.metadata[j][i] = this.metadata[j][i].split('/');
                        }
                    }
                }

                if (count > 1) { this.tasks.push.apply(this.tasks, onelf) }
            }
        },

        nextTask() {
            this.clearFields();

            const taskIndex = parseInt(Math.random() * this.tasks.length);

            this.task = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);

            this.currentSampleIndexes = [];
            this.sampleString = '';

            for (let i = 2; i < this.metadata.length; i++) {
                if (i !== this.task.wordIndex && this.metadata[i][this.task.lfIndex] !== '' &&
                    (
                        this.metadata[i][this.task.lfIndex].length > 1 ||
                        this.metadata[this.task.wordIndex][this.task.lfIndex].length > 1 ||
                        this.metadata[i][this.task.lfIndex][0] !== this.metadata[this.task.wordIndex][this.task.lfIndex][0]
                    )
                ) { this.currentSampleIndexes.push(i) }
            }

            this.nextSample();
        },

        clearFields() {
            this.isTaskSolved = false;
            this.isCorrect = undefined;
            this.definition = '';
            this.currentAnswer = '';
        },

        nextSample() {
            const sampleIndexIndex = parseInt(Math.random() * this.currentSampleIndexes.length);
            const sampleIndex = this.currentSampleIndexes[sampleIndexIndex];
            const sampleValueIndex = parseInt(Math.random() * this.metadata[sampleIndex][this.task.lfIndex].length);

            this.currentSampleIndexes.splice(sampleIndexIndex, 1);
            this.sampleString += `${this.metadata[sampleIndex][0]} - ${this.metadata[sampleIndex][this.task.lfIndex][sampleValueIndex]}. `;
        },

        showDefinition() {
            this.definition = this.metadata[1][this.task.lfIndex];
        },

        giveUp() {
            this.isCorrect = undefined;
            this.definition = this.metadata[1][this.task.lfIndex];
            this.currentAnswer = this.metadata[this.task.wordIndex][this.task.lfIndex][0];
            this.isTaskSolved = true;
        },

        submitAnswer() {
            const formattedAnswer = this.currentAnswer.trim();

            this.isCorrect = this.metadata[this.task.wordIndex][this.task.lfIndex].some(
                (realAnswer) => formattedAnswer === realAnswer || formattedAnswer.replace('ё', 'е') === realAnswer
            );

            if (this.isCorrect) {
                this.isTaskSolved = true;
                this.answerReaction = `Правильно! Это ${formattedAnswer}.`;
            } else {
                this.answerReaction = `Увы! Это не ${formattedAnswer}.`;
            }
        }
    }
};
</script>
