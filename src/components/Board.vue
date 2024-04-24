<template>
    <div class="w-screen h-screen rounded-xl mx-auto p-14">
        <div class="border border-gray-700 w-full h-full rounded-xl flex items-center justify-center overflow-auto px-10"
            ref="board">
            <div v-if="playableDomino">
                <div v-if="playableDomino.placement.includes(0)">
                    <div :class="{ 'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino) }"
                        @click="playDomino(0)">
                    </div>
                </div>

            </div>
            <div v-for="domino in dominosOnBoard">
                <Domino :domino="domino.domino" class="absolute" :style="getPlacement(domino)"
                    :placeHorizontal="!isDouble(domino.domino)" />
            </div>
            <div class="flex">
                <div v-if="playableDomino">
                    <div v-if="playableDomino.placement.includes(1)">
                        <div :class="{ 'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino) }"
                            @click="playDomino(1)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { toHandlers } from 'vue';
import Domino from './Domino.vue';
export default {
    props: {
        playableDomino: {
            type: Object,
            required: false
        },
    },
    data() {
        return {
            dominosOnBoard: [],
            boardWidth: 0,
            boardHeight: 0,
            dominoWidth: 56,
            dominoHeight: 96,
        }
    },
    methods: {
        playDomino(selectedPosition) {
            if (selectedPosition === 0) {
                // In the case where the domino could have been placed in two positions, we check if we need to do a rotation
                this.$emit('on-play-domino', this.playableDomino.domino, 0, this.playableDomino.rotate0);
            } else {
                this.$emit('on-play-domino', this.playableDomino.domino, 1, this.playableDomino.rotate1);
            }

        },
        isDouble(domino) {
            return domino.top === domino.bottom;
        },
        addToBoard(domino, placement) {
            // This is the first domino, don't need to check anything
            if (this.dominosOnBoard.length === 0) {
                let dominoToAdd = {
                    domino: domino,
                    x: this.boardWidth / 2 + 27,
                    y: this.boardHeight / 2 + 5,
                }
                this.dominosOnBoard.push(dominoToAdd);
                return;
            } else {
                // check if left or right 0 is left, 1 is right
                let dominoToAdd = {}
                if (placement === 0) {
                    // Now check if its a double or not, if it is the spacing is different
                    if (this.isDouble(domino)) {
                        dominoToAdd = {
                            domino: domino,
                            x: this.dominosOnBoard[0].x - this.dominoWidth,
                            y: this.boardHeight / 2 + 5,

                        }
                    // Not a double, so just use the normal spacing
                    } else {
                        // We need to check if the previous one was a normal domino or a double
                        dominoToAdd = {
                            domino: domino,
                            x: this.dominosOnBoard[0].x - this.dominoHeight,
                            y: this.boardHeight / 2 + 22,
                        }
                    }
                // Placement is 1, so we need to add to the right
                } else {
                    // Now we check if its a double or not, if it is the spacing is different
                    if (this.isDouble(domino)) {
                        dominoToAdd = {
                            domino: domino,
                            x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoHeight,
                            y: this.boardHeight / 2 + 5,
                        }
                    } else {
                        dominoToAdd = {
                            domino: domino,
                            x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoWidth,
                            y: this.boardHeight / 2 + 22,
                        }
                    }
                }
                this.pushToBoard(dominoToAdd, placement);
            }
        },
        pushToBoard(dominoToAdd, placement) {
            if (placement === 0) {
                this.dominosOnBoard.unshift(dominoToAdd);
            } else {
                this.dominosOnBoard.push(dominoToAdd);
            }
        },
        getPlacement(domino) {
            return `top:${domino.y}px; left: ${domino.x}px`;
        }
    },
    mounted() {
        this.boardWidth = this.$refs.board.clientWidth;
        this.boardHeight = this.$refs.board.clientHeight;
    },
    components: { Domino },
}
</script>
<style scoped>
.domino-placeholder-vertical {
    @apply rounded-lg border border-yellow-200 h-24 w-14 px-1 flex justify-between flex-col relative cursor-pointer;
}

.domino-placeholder-horizontal {
    @apply rounded-lg border border-yellow-200 h-14 w-24 px-1 flex justify-between flex-col relative cursor-pointer;
}
</style>
