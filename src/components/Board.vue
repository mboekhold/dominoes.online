<template>
    <div class="w-screen h-screen rounded-xl mx-auto p-14">
        <div class="border border-gray-700 w-full h-full rounded-xl flex items-center justify-center overflow-auto px-10 py-20 relative"
            ref="board">
            <div ref="playingArea" id="playingArea" class="relative h-full w-full overflow-auto">
                <div v-if="tailPreviewDomino" class="absolute" ref="tailPreview"
                    :class="{ 'domino-placeholder-horizontal': !isDouble(tailPreviewDomino), 'domino-placeholder-vertical': isDouble(tailPreviewDomino) }"
                    @click="playDomino(tailPreviewDomino, 0)" :style="getPlacement(tailPreviewDomino)">
                </div>
                <Domino v-for="domino in dominosOnBoard" :domino="domino" class="absolute" :style="getPlacement(domino)"
                    :placeHorizontal="!isDouble(domino)" :id="`domino-${domino.id}`" :ref="`domino-${domino.id}`">
                </Domino>
                <div v-if="headPreviewDomino" class="absolute" ref="headPreview"
                    :class="{ 'domino-placeholder-horizontal': !isDouble(headPreviewDomino), 'domino-placeholder-vertical': isDouble(headPreviewDomino) }"
                    @click="playDomino(headPreviewDomino, 1)" :style="getPlacement(headPreviewDomino)">
                </div>
                <div class="absolute h-10 w-10 -bottom-60">

                </div>
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
            horizontalDominoOffset: 20,
            tailTransitioningDominos: [],
            headTransitioningDominos: [],
            // transitionTail: null,
            reverseTail: false,
            reverseHead: false,
            currentHeadRow: 0,
            currentTailRow: 0,
        }
    },
    methods: {
        playDomino(domino, selectedPosition) {
            const id = this.dominosOnBoard.length;
            domino.id = id;
            if (selectedPosition === 0) {
                if (domino.rotate0) {
                    this.rotateDomino(domino);
                }
                this.addToBoard(domino, 0);
            } else {
                if (domino.rotate1) {
                    this.rotateDomino(domino);
                }
                this.addToBoard(domino, 1);
                setTimeout(() => {
                    const dominoRef = this.$refs[`domino-${domino.id}`];
                }, 100);
            }
            // }
            this.$emit('on-play-domino', domino);
            this.tailPreviewDomino = null;
            this.headPreviewDomino = null;
        },
        isDouble(domino) {
            if (domino.forceHorizontal) {
                return false;
            }
            return domino.top === domino.bottom || domino.forceVertical;
        },
        previewPlacement(domino, placement) {
            let dominoPlacement = this.getNextDominoPlacement(domino.domino, domino.placement);
            return `top:${dominoPlacement.y}px; left: ${dominoPlacement.x}px`;
        },
        previewDominoPlacement(domino) {
            if (!domino) {
                this.tailPreviewDomino = null;
                this.headPreviewDomino = null;
                return
            }
            // Set where it can be placed and if it needs to be rotated
            this.setNextPlacementDetails(domino);
            if (domino.placement.includes(0)) {
                this.tailPreviewDomino = { ...domino };
                const coordinates = this.getNextDominoPlacement(this.tailPreviewDomino, 0);
                this.tailPreviewDomino.x = coordinates.x;
                this.tailPreviewDomino.y = coordinates.y;
                this.tailPreviewDomino.reverse = coordinates.reverse;
                this.tailPreviewDomino.forceHorizontal = coordinates.forceHorizontal;
                this.tailPreviewDomino.forceVertical = coordinates.forceVertical;
                this.tailPreviewDomino.transitioning = coordinates.transitioning;
                this.tailPreviewDomino.transitionOver = coordinates.transitionOver;
            }
            if (domino.placement.includes(1)) {
                this.headPreviewDomino = { ...domino };
                const coordinates = this.getNextDominoPlacement(this.headPreviewDomino, 1);
                this.headPreviewDomino.x = coordinates.x;
                this.headPreviewDomino.y = coordinates.y;
                this.headPreviewDomino.reverse = coordinates.reverse;
                this.headPreviewDomino.forceHorizontal = coordinates.forceHorizontal;
                this.headPreviewDomino.forceVertical = coordinates.forceVertical;
                this.headPreviewDomino.transitioning = coordinates.transitioning;
                this.headPreviewDomino.transitionOver = coordinates.transitionOver;
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
            if (this.dominosOnBoard.length === 0) {
                if (this.isDouble(domino)) {
                    return {
                        x: this.boardWidth / 2 - this.dominoWidth / 2,
                        y: this.boardHeight / 2 - this.dominoHeight / 2,
                    }
                } else if (!this.isDouble(domino)) {
                    return {
                        x: this.boardWidth / 2 - this.dominoHeight / 2,
                        y: this.boardHeight / 2 + this.horizontalDominoOffset,
                    }
                }
            } else if (this.dominosOnBoard.length > 0) {
                if (placement === 0) {
                    if (this.currentTailRow % 2 === 0) {
                        if (this.transitionTail) {
                            return this.getTailTransitioningDomino(domino);
                        }
                        else if (this.transitionTailOver) {
                            return this.getTransitionTailOverDomino(domino);
                        }
                        else if (this.reverseTail) {
                            return this.getTailPlacement(domino);
                        }
                        return this.getTailPlacement(domino);
                    } else if (this.currentTailRow % 2 === 1) {
                        if (this.transitionTail) {
                            return this.getTailTransitioningDominoReverse(domino);
                        }
                        else if (this.transitionTailOver) {
                            return this.getTransitionTailOverDominoReverse(domino);
                        }
                        else if (this.reverseTail) {
                            return this.getTailPlacementReverse(domino);
                        }
                        return this.getTailPlacement(domino);
                    }
                } else if (placement === 1) {
                    if (this.currentHeadRow % 2 === 0) {
                        if (this.transitionHead) {
                            return this.getHeadTransitioningDomino(domino);
                        }
                        else if (this.transitionHeadOver) {
                            return this.getTransitionHeadOverDomino(domino);
                        }
                        else if (this.reverseHead) {
                            return this.getHeadPlacement(domino);
                        }
                        return this.getHeadPlacement(domino);
                    } else if (this.currentHeadRow % 2 === 1) {
                        if (this.transitionHead) {
                            return this.getHeadTransitioningDominoReverse(domino);
                        }
                        else if (this.transitionHeadOver) {
                            return this.getTransitionHeadOverDominoReverse(domino);
                        }
                        else if (this.reverseHead) {
                            return this.getHeadPlacementReverse(domino);
                        }
                        return this.getHeadPlacement(domino);
                    }
                }
            }
        },
        addToBoard(domino, placement) {
            domino["placement"] = placement;
            if (placement === 0) {
                this.dominosOnBoard.unshift(domino);
                if (domino.transitionOver) {
                    this.currentTailRow++;
                    this.moveDominoDown();
                }
            } else {
                if(domino.transitionOver){
                    this.currentHeadRow++;
                }
                this.dominosOnBoard.push(domino);
            }
        },
        getPlacement(domino) {
            if (domino.reverse) {
                return `top:${domino.y}px; left: ${domino.x}px; transform: rotate(180deg);`;
            }
            return `top:${domino.y}px; left: ${domino.x}px;`;
        },
        isOverflowing(domino, placement) {
            if (this.dominosOnBoard.length === 0) {
                return false;
            }
            if (placement === 0) {
                if (this.currentTailRow % 2 === 0) {
                    const lastDomino = this.dominosOnBoard[0];
                    if (lastDomino.x - this.dominoWidth <= this.dominoHeight) {
                        return true;
                    }
                } else {
                    const lastDomino = this.dominosOnBoard[0];
                    if (lastDomino.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                        return true;
                    }
                }
                // Get the last played domino on the tail side
            } else {
                if (this.currentHeadRow % 2 === 0) {
                    const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                    if (lastDomino.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                        return true;
                    }
                }
            }
        },
        rotateDomino(domino) {
            let bottom = domino.bottom;
            domino.bottom = domino.top;
            domino.top = bottom;
        },
        getTailPlacement(domino) {
            if (this.isDouble(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[0]
                if (!this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x - this.dominoWidth,
                        y: lastDomino.y - this.horizontalDominoOffset,
                    }
                }
                return {
                    x: lastDomino.x - this.dominoWidth,
                    y: lastDomino.y,
                }
            } else if (!this.isDouble(domino)) {
                // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                const lastDomino = this.dominosOnBoard[0]
                if (this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x - this.dominoHeight,
                        // We want to put it in the middle, so thats why the offset
                        y: lastDomino.y + this.horizontalDominoOffset,
                    }
                } else if (!this.isDouble(lastDomino)) {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.x - this.dominoHeight,
                        y: lastDomino.y,
                    }
                } else {
                    return {
                        x: lastDomino.x - this.dominoHeight,
                        y: lastDomino.y,
                    }

                }
            }
        },
        getTailPlacementReverse(domino) {
            if (this.isDouble(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[0]
                if (!this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoHeight,
                        y: lastDomino.y - this.horizontalDominoOffset,
                        reverse: true,
                    }
                }
                return {
                    x: lastDomino.x + this.dominoWidth,
                    y: lastDomino.y,
                    reverse: true,
                }
            } else if (!this.isDouble(domino)) {
                // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                const lastDomino = this.dominosOnBoard[0]
                if (this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoWidth,
                        // We want to put it in the middle, so thats why the offset
                        y: lastDomino.y + this.horizontalDominoOffset,
                        reverse: true,
                    }
                } else if (!this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoHeight,
                        y: lastDomino.y,
                        reverse: true,
                    }
                } else {
                    return {
                        x: lastDomino.x + this.dominoHeight,
                        y: lastDomino.y,
                        reverse: true,
                    }

                }
            }
        },
        getHeadPlacement(domino) {
            if (this.isDouble(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (!this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoHeight,
                        y: lastDomino.y - this.horizontalDominoOffset,
                    }
                }
                return {
                    x: lastDomino.x + this.dominoWidth,
                    y: lastDomino.y - this.horizontalDominoOffset,
                }
            } else {
                // We need to check if the previous one was a normal domino or a double from the same placement
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoWidth,
                        y: lastDomino.y + this.horizontalDominoOffset,
                    }
                } else {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.x + this.dominoHeight,
                        y: lastDomino.y,
                    }
                }
            }
        },
        getHeadPlacementReverse(domino) {
            if (this.isDouble(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (!this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x + this.dominoWidth,
                        y: lastDomino.y - this.horizontalDominoOffset,
                        reverse: true,
                    }
                }
                return {
                    x: lastDomino.x + this.dominoWidth,
                    y: lastDomino.y - this.horizontalDominoOffset,
                    reverse: true,
                }
            } else {
                // We need to check if the previous one was a normal domino or a double from the same placement
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (this.isDouble(lastDomino)) {
                    return {
                        x: lastDomino.x - this.dominoHeight,
                        y: lastDomino.y + this.horizontalDominoOffset,
                        reverse: true,
                    }
                } else {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.x - this.dominoHeight,
                        y: lastDomino.y,
                        reverse: true,
                    }
                }
            }
        },
        getTailTransitioningDomino(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[0]
            if (!this.isDouble(lastDomino)) {
                return {
                    x: lastDomino.x,
                    y: lastDomino.y - (this.dominoHeight),
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.x,
                y: lastDomino.y - this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getHeadTransitioningDomino(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            if (!this.isDouble(lastDomino)) {
                return {
                    x: lastDomino.x + this.dominoHeight / 2 - 5,
                    y: lastDomino.y + this.dominoWidth,
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.x,
                y: lastDomino.y + this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getTailTransitioningDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[0]
            if (!this.isDouble(lastDomino)) {
                return {
                    x: lastDomino.x + this.dominoWidth - 18,
                    y: lastDomino.y - (this.dominoHeight),
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.x,
                y: lastDomino.y - this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getHeadTransitioningDominoReverse(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            if (!this.isDouble(lastDomino)) {
                return {
                    x: lastDomino.x,
                    y: lastDomino.y + this.dominoWidth,
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.x,
                y: lastDomino.y + this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getTransitionTailOverDomino(domino) {
            const lastDomino = this.dominosOnBoard[0]
            return {
                x: lastDomino.x + this.dominoWidth,
                y: lastDomino.y,
                forceHorizontal: true,
                reverse: true,
                transitionOver: true,
            }

        },
        getTransitionHeadOverDomino(domino){
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            return {
                x: lastDomino.x - this.dominoHeight,
                y: lastDomino.y + this.dominoHeight / 2 - 10,
                forceHorizontal: true,
                transitionOver: true,
                reverse: true,
            }
        },
        getTransitionTailOverDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[0]
            return {
                x: lastDomino.x - this.dominoHeight,
                y: lastDomino.y,
                forceHorizontal: true,
                transitionOver: true,
            }
        },
        getTransitionHeadOverDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            return {
                x: lastDomino.x + this.dominoWidth,
                y: lastDomino.y + this.dominoHeight / 2 - 10,
                forceHorizontal: true,
                transitionOver: true,
            }
        },
        moveDominoDown() {
            const currentScroll = this.$refs.playingArea.scrollTop;
            this.dominosOnBoard.forEach((domino) => {
                domino.y += this.dominoHeight * 2 + 20;
            });
            this.$refs.playingArea.scrollTo(0, currentScroll + this.dominoHeight * 2 + 20);
        }
    },
    computed: {
        transitionTail() {
            const lastDomino = this.dominosOnBoard[0];
            const last2Dominos = this.dominosOnBoard.slice(0, 2);
            // Tranisition is done when the last 2 dominos are transitioning
            const count = last2Dominos.filter(domino => domino.transitioning).length;
            if (count === 2) {
                return false;
            }
            if (this.currentTailRow % 2 === 0) {
                if (lastDomino.x - this.dominoWidth <= this.dominoHeight) {
                    return true;
                }
                return false
            }
            else if (this.currentTailRow % 2 === 1) {
                if (lastDomino.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                    return true;
                }
                return false
            }
        },
        transitionTailOver() {
            const last2Dominos = this.dominosOnBoard.slice(0, 2);
            const count = last2Dominos.filter(domino => domino.transitioning).length;
            if (count === 2) {
                this.reverseTail = true;
                return true;
            }
        },
        transitionHead() {
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1];
            const last2Dominos = this.dominosOnBoard.slice(this.dominosOnBoard.length - 2, this.dominosOnBoard.length);
            // Tranisition is done when the last 2 dominos are transitioning
            const count = last2Dominos.filter(domino => domino.transitioning).length;
            if (count === 2) {
                return false;
            }
            if (this.currentHeadRow % 2 === 0) {
                if (lastDomino.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                    return true;
                }
                return false
            }
            else if (this.currentHeadRow % 2 === 1) {
                if (lastDomino.x - this.dominoWidth <= this.dominoHeight) {
                    return true;
                }
                return false
            }
        },
        transitionHeadOver() {
            const last2Dominos = this.dominosOnBoard.slice(this.dominosOnBoard.length - 2, this.dominosOnBoard.length);
            const count = last2Dominos.filter(domino => domino.transitioning).length;
            if (count === 2) {
                this.reverseHead = true;
                return true;
            }
        }
    },
    mounted() {
        this.boardWidth = this.$refs.playingArea.clientWidth;
        this.boardHeight = this.$refs.playingArea.clientHeight + this.dominoHeight;
        this.$refs.playingArea.scrollTo(0, this.dominoWidth, "smooth");
    },
    watch: {
        // When scroll bar is all the way down its hard to see that you can still play on head side. we can improve this
        // By scrolling down
        headPreviewDomino(val) {
            if(val) {
                if(!this.tailPreviewDomino) {
                    setTimeout(() => {
                        const boardView = this.$refs.board.getBoundingClientRect();
                        const rect = this.$refs.headPreview.getBoundingClientRect();
                        if (rect.bottom + this.dominoHeight >= boardView.bottom) {
                            this.$refs.playingArea.scrollTo(0, this.$refs.playingArea.scrollHeight, "smooth");
                        }
                    }, 200);
                }
            }
        },
        tailPreviewDomino(val) {
            if(val) {
                if(!this.headPreviewDomino) {
                    setTimeout(() => {
                        const boardView = this.$refs.board.getBoundingClientRect();
                        const rect = this.$refs.tailPreview.getBoundingClientRect();
                        if (rect.top - this.dominoHeight <= boardView.top) {
                            this.$refs.playingArea.scrollTo(0, 50, "smooth");
                        }
                    }, 200);
                }
            }
        }
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

::-webkit-scrollbar {
    display: none;
}
#playingArea {
    scroll-behavior: smooth;
}

</style>
