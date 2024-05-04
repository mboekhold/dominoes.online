<template>
    <div class="w-screen h-screen rounded-xl mx-auto p-14">
        <div class="border border-gray-700 w-full h-full rounded-xl flex items-center justify-center overflow-auto px-10"
            ref="board">
            <div v-if="tailPreviewDomino"
                class="absolute" :class="{ 'domino-placeholder-horizontal': !isDouble(tailPreviewDomino), 'domino-placeholder-vertical': isDouble(tailPreviewDomino) }"
                @click="playDomino(tailPreviewDomino, 0)" :style="getPlacement(tailPreviewDomino)">
            </div>
            <div v-for="domino in dominosOnBoard">
                <Domino :domino="domino" class="absolute" :style="getPlacement(domino)"
                    :placeHorizontal="!isDouble(domino)">
                </Domino>
            </div>
            <div v-if="headPreviewDomino"
                class="absolute" :class="{ 'domino-placeholder-horizontal': !isDouble(headPreviewDomino), 'domino-placeholder-vertical': isDouble(headPreviewDomino) }"
                @click="playDomino(headPreviewDomino, 1)" :style="getPlacement(headPreviewDomino)">
            </div>
        </div>
    </div>
</template>
<script>
import Domino from './Domino.vue';
export default {
    data() {
        return {
            dominosOnBoard: [],
            tailPreviewDomino: null,
            headPreviewDomino: null,
            boardWidth: 0,
            boardHeight: 0,
            dominoWidth: 56,
            dominoHeight: 96,
            verticalDominoOffset: 20,
            horizontalDominoOffset: 20
        }
    },
    methods: {
        playDomino(domino, selectedPosition) {
            if (selectedPosition === 0) {
                if(domino.rotate0) {
                    this.rotateDomino(domino);
                }
                this.addToBoard(domino, 0);
            } else {
                if(domino.rotate1) {
                    this.rotateDomino(domino);
                }
                this.addToBoard(domino, 1);
            }
            // }
            this.$emit('on-play-domino', domino);
            this.tailPreviewDomino = null;
            this.headPreviewDomino = null;
        },
        isDouble(domino) {
            return domino.top === domino.bottom;
        },
        previewPlacement(domino, placement) {
            let dominoPlacement = this.getNextDominoPlacement(domino.domino, domino.placement);
            return `top:${dominoPlacement.y}px; left: ${dominoPlacement.x}px`;
        },
        previewDominoPlacement(domino) {
            console.log("preview domino");
            if (!domino) {
                this.tailPreviewDomino = null;
                this.headPreviewDomino = null;
                return
            }
            // Set where it can be placed and if it needs to be rotated
            this.setNextPlacementDetails(domino);
            console.log(domino);
            if (domino.placement.includes(0)) {
                this.tailPreviewDomino = {...domino };
                const coordinates = this.getNextDominoPlacement(this.tailPreviewDomino, 0);
                this.tailPreviewDomino.x = coordinates.x;
                this.tailPreviewDomino.y = coordinates.y;
            } 
            if (domino.placement.includes(1)) {
                console.log("can be placed at head");
                this.headPreviewDomino = {...domino};
                const coordinates = this.getNextDominoPlacement(this.headPreviewDomino, 1);
                this.headPreviewDomino.x = coordinates.x;
                this.headPreviewDomino.y = coordinates.y;
            }
        },
        setNextPlacementDetails(domino) {
            if (!domino) {
                return
            }
            if (this.dominosOnBoard.length === 0) {
                domino.rotate0 = false;
                domino.rotate1 = false;
                domino.placement = [0];
               return
            } else if (this.dominosOnBoard.length === 1) {
                let head = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                // Domino can be placed on both sides..
                if ((head.top === domino.top || head.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    domino.rotate0 = head.top === domino.top;
                    domino.rotate1 = head.top === domino.bottom;
                    domino.placement = [0, 1];
                    return
                }
                else if (head.top === domino.top) {
                    domino.rotate0 = true;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return
                } else if (head.top === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return
                } else if (head.bottom === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = true;
                    domino.placement = [1];
                    return
                } else if (head.bottom === domino.top) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [1];
                }
            } else {
                let tail = this.dominosOnBoard[0];
                let head = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                if ((tail.top === domino.top || tail.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    domino.rotate0 = tail.top === domino.top;
                    domino.rotate1 = head.bottom === domino.bottom;
                    domino.placement = [0, 1];
                    return
                }
                else if (tail.top === domino.top) {
                    domino.rotate0 = true;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return
                } else if (tail.top === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return
                } else if (head.bottom === domino.top) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [1];
                    return
                } else if (head.bottom === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = true;
                    domino.placement = [1];
                    return
                }
            }
        },
        getNextDominoPlacement(domino, placement) {
            // This is the first domino, don't need to check anything
            if (this.dominosOnBoard.length === 0) {
                if (this.isDouble(domino)) {
                    return {
                        x: this.boardWidth / 2,
                        y: this.boardHeight / 2,
                    }
                } else if (!this.isDouble(domino)) {
                    return {
                        x: this.boardWidth / 2,
                        y: this.boardHeight / 2 + this.horizontalDominoOffset,
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
                        if (!this.isDouble(lastDomino)) {
                            return {
                                x: this.dominosOnBoard[0].x - this.dominoWidth,
                                y: this.boardHeight / 2,
                            }
                        }
                        return {
                            x: this.dominosOnBoard[0].x - this.dominoWidth,
                            y: this.boardHeight / 2,
                        }
                    } else if (!this.isDouble(domino)) {
                        // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        if (this.isDouble(lastDomino) && lastDomino.placement === 0) {
                            return {
                                x: this.dominosOnBoard[0].x - this.dominoHeight,
                                // We want to put it in the middle, so thats why the offset
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            }
                        } else if (!this.isDouble(lastDomino)) {
                            // Last one was not a double so we need more spacing
                            console.log("last one was not a double")
                            return {
                                x: this.dominosOnBoard[0].x - this.dominoHeight,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            }
                        } else {
                            return {
                                x: this.dominosOnBoard[0].x - this.dominoHeight,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            }
                        
                        }
                    }
                    // Placement is 1, so we need to add to the right
                } else if (placement === 1) {
                    console.log("placement is 1")
                    // Now we check if its a double or not, if it is the spacing is different
                    if (this.isDouble(domino)) {
                        // For the edge case where someone doesnt start with a double, we need to check if 
                        // the last one was a normal one
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        console.log(lastDomino)
                        if (!this.isDouble(lastDomino)) {
                            return {
                                x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoHeight,
                                y: this.boardHeight / 2,
                            }
                        }
                        return {
                            x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoWidth,
                            y: this.boardHeight / 2 + this.horizontalDominoOffset,
                        }
                    } else {
                        // We need to check if the previous one was a normal domino or a double from the same placement
                        const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                        if (this.isDouble(lastDomino)) {
                            return {
                                x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoWidth,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            }
                        } else {
                            // Last one was not a double so we need more spacing
                            return {
                                x: this.dominosOnBoard[this.dominosOnBoard.length - 1].x + this.dominoHeight,
                                y: this.boardHeight / 2 + this.horizontalDominoOffset,
                            }
                        }
                    }
                }

            }
        },
        addToBoard(domino, placement) {
            domino["placement"] = placement;
            if (placement === 0) {
                this.dominosOnBoard.unshift(domino);
            } else {
                this.dominosOnBoard.push(domino);
            }
        },
        getPlacement(domino) {
            return `top:${domino.y}px; left: ${domino.x}px`;
        },
        rotateDomino(domino) {
            let bottom = domino.bottom;
            domino.bottom = domino.top;
            domino.top = bottom;
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
    @apply rounded-lg border border-yellow-200 h-24 w-14 px-1 flex justify-between flex-col cursor-pointer;
}

.domino-placeholder-horizontal {
    @apply rounded-lg border border-yellow-200 h-14 w-24 px-1 flex justify-between flex-col cursor-pointer;
}
</style>
