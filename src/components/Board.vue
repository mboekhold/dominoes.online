<template>
    <div class="w-screen h-screen rounded-xl mx-auto p-14">
        <div class="border border-gray-700 w-full h-full rounded-xl flex items-center justify-center overflow-auto px-10"
            ref="board">
            <div v-if="playableDomino">
                <div v-if="playableDomino.placement.includes(0)">
                    <div class="absolute" :class="{ 'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino) }"
                        @click="playDomino(0)" :style="previewPlacement(playableDomino)">
                    </div>
                </div>
            </div>
            <div v-for="domino in dominosOnBoard">
                <Domino :domino="domino.domino" class="absolute" :style="getPlacement(domino)"
                    :placeHorizontal="!isDouble(domino.domino)" />
            </div>
            <div>
                <div v-if="playableDomino">
                    <div v-if="playableDomino.placement.includes(1)">
                        <div class="absolute" :class="{ 'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino) }"
                            @click="playDomino(1)" :style="previewPlacement(playableDomino)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
            verticalDominoOffset: 20,
            horizontalDominoOffset: 20
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
        previewPlacement(domino, placement) {
            let dominoPlacement = this.getNextDominoPlacement(domino.domino, domino.placement);
            return `top:${dominoPlacement.y}px; left: ${dominoPlacement.x}px`;
        },
        previewDominoPlacement(domino, placement) {
            const dominoToAdd = this.getNextDominoPlacement(domino, placement);
            return dominoToAdd;
        },
        getNextDominoPlacement(domino, placement) {
            // This is the first domino, don't need to check anything
            if (this.dominosOnBoard.length === 0) {
                if (this.isDouble(domino)) {
                    return {
                        domino: domino,
                        x: this.boardWidth / 2,
                        y: this.boardHeight / 2,
                        placement: placement
                    }
                } else if (!this.isDouble(domino)) {
                    return {
                        domino: domino,
                        x: this.boardWidth / 2,
                        y: this.boardHeight / 2 + this.horizontalDominoOffset,
                        placement: placement
                    }
                }
            } else if (this.dominosOnBoard.length > 0) {
                // check if left or right 0 is left, 1 is right
                if (placement === 0) {
                    // Now check if its a double or not, if it is the spacing is different
                    if (this.isDouble(domino)) {
                        // For the edge case where someone doesnt start with a double, we need to check if 
                        // the last one was a normal one
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        if (!this.isDouble(lastDomino.domino)) {
                            return {
                                domino: domino,
                                x: this.dominosOnBoard[0].x - this.dominoWidth,
                                y: this.boardHeight / 2,
                                placement: placement
                            }
                        }
                        return {
                            domino: domino,
                            x: this.dominosOnBoard[0].x - this.dominoWidth,
                            y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            placement: placement
                        }
                    } else if (!this.isDouble(domino)) {
                        // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        if (this.isDouble(lastDomino.domino) && lastDomino.placement === 0) {
                            return {
                                domino: domino,
                                x: this.dominosOnBoard[0].x - this.dominoHeight,
                                // We want to put it in the middle, so thats why the offset
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                                placement: placement
                            }
                        } else if (!this.isDouble(lastDomino.domino)) {
                            // Last one was not a double so we need more spacing
                            return {
                                domino: domino,
                                x: this.dominosOnBoard[0].x - this.dominoHeight,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                                placement: placement
                            }
                        }
                    }
                    // Placement is 1, so we need to add to the right
                } else if (placement === 1) {
                    // Now we check if its a double or not, if it is the spacing is different
                    if (this.isDouble(domino)) {
                        return {
                            domino: domino,
                            x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoHeight,
                            y: this.boardHeight / 2,
                            placement: placement
                        }
                    } else {
                        // We need to check if the previous one was a normal domino or a double from the same placement
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        if (this.isDouble(lastDomino.domino)) {
                            return {
                                domino: domino,
                                x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoWidth,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                                placement: placement
                            }
                        } else {
                            // Last one was not a double so we need more spacing
                            return {
                                domino: domino,
                                x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoHeight,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                                placement: placement
                            }
                        }
                    }
                }

            }
        },
        addToBoard(domino, placement) {
            const dominoToAdd = this.getNextDominoPlacement(domino, placement);
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
    @apply rounded-lg border border-yellow-200 h-24 w-14 px-1 flex justify-between flex-col  cursor-pointer;
}

.domino-placeholder-horizontal {
    @apply rounded-lg border border-yellow-200 h-14 w-24 px-1 flex justify-between flex-col  cursor-pointer;
}
</style>
