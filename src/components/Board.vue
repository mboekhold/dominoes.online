<template>
    <div class="w-full h-screen rounded-xl mx-auto p-4 relative">
        <div class="border-t border-l border-r border-gray-700 w-full h-full rounded-t-xl flex items-center justify-center relative"
            ref="board">
            <div class="w-full h-full pb-[100px] sm:pt-12">
                <div ref="playingArea" id="playingArea" class="relative h-full w-full"
                    :class="{ 'overflow-hidden': disableScroll, 'overflow-auto': !disableScroll }">
                    <div class="w-fit">
                        <div v-if="tailPreviewDomino" class="absolute preview" id="tailPreview" ref="tailPreview"
                            :class="{ 'domino-placeholder-horizontal': !shouldPlaceDominoVertical(tailPreviewDomino), 'domino-placeholder-vertical': shouldPlaceDominoVertical(tailPreviewDomino) }"
                            @click="playDomino(tailPreviewDomino, 0)"
                            :style="getPlacementCoordinates(tailPreviewDomino)">
                        </div>
                        <Domino v-for="domino in dominosOnBoard" :domino="domino" class="absolute"
                            :style="getPlacementCoordinates(domino)"
                            :placeHorizontal="!shouldPlaceDominoVertical(domino)" :id="`domino-${domino.id}`"
                            :ref="`domino-${domino.id}`">
                        </Domino>
                        <div v-if="headPreviewDomino" class="absolute preview" id="headPreview" ref="headPreview"
                            :class="{ 'domino-placeholder-horizontal': !shouldPlaceDominoVertical(headPreviewDomino), 'domino-placeholder-vertical': shouldPlaceDominoVertical(headPreviewDomino) }"
                            @click="playDomino(headPreviewDomino, 1)"
                            :style="getPlacementCoordinates(headPreviewDomino)">
                        </div>
                    </div>
                    <div class="absolute h-10 w-10 -bottom-60">

                    </div>
                    <div v-if="showChevronUp"
                        class="rounded-full border-gray-600 border p-1 flex items-center justify-center bg-white fixed top-32 sm:top-24 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-6 h-6 text-black">
                            <path fill-rule="evenodd"
                                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div v-if="showChevronDown"
                        class="rounded-full border-gray-600  border p-1 flex items-center justify-center bg-white fixed bottom-20 sm:bottom-32 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-6 h-6 text-black">
                            <path fill-rule="evenodd"
                                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="absolute bottom-0 h-64 w-full bg-[#282833] transition-transform duration-500"
                    :class="{ 'translate-y-0': dealing, 'translate-y-96': !dealing }">
                    <div class="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1">
                        <div v-for="(domino, index) in dominoSetLength" class="bg-white rounded-md h-10 w-6 sm:h-14 sm:w-7"
                            :id="`dealDomino${index}`" :ref="`dealDomino${index}`">

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
        dealing: Boolean
    },
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
            showChevronDown: false,
            showChevronUp: false,
            disableScroll: false,
            dominoSetLength: 28,
            isMobile: false,
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
            this.$emit('on-play-domino', domino, selectedPosition);
            this.tailPreviewDomino = null;
            this.headPreviewDomino = null;
        },
        placeDomino(domino, selectedPosition) {
            const dominoPlacement = this.getNextPlacementOptions(domino);
            dominoPlacement.location = this.getNextDominoPlacementLocation(domino, selectedPosition);
            // this.getPlacementCoordinates(domino);
            const id = this.dominosOnBoard.length;
            dominoPlacement.id = id;
            if (selectedPosition === 0) {
                if (dominoPlacement.rotate0) {
                    this.rotateDomino(dominoPlacement);
                }
                this.addToBoard(dominoPlacement, 0);
            } else {
                if (dominoPlacement.rotate1) {
                    this.rotateDomino(dominoPlacement);
                }
                this.addToBoard(dominoPlacement, 1);
            }
        },
        shouldPlaceDominoVertical(domino) {
            if (domino.location) {
                if (domino.location.forceHorizontal) {
                    return false;
                }
                else if (domino.location.forceVertical) {
                    return true;
                }
            }
            return domino.top === domino.bottom;
        },
        previewDominoPlacement(domino) {
            if (!domino) {
                this.tailPreviewDomino = null;
                this.headPreviewDomino = null;
                return
            }
            // Set where it can be placed and if it needs to be rotated
            const dominoPlacement = this.getNextPlacementOptions(domino);
            if (dominoPlacement) {
                if (dominoPlacement.placement.includes(0)) {
                    this.tailPreviewDomino = { ...dominoPlacement };
                    this.tailPreviewDomino.location = this.getNextDominoPlacementLocation(this.tailPreviewDomino, 0);
                }
                if (domino.placement.includes(1)) {
                    this.headPreviewDomino = { ...domino };
                    this.headPreviewDomino.location = this.getNextDominoPlacementLocation(this.headPreviewDomino, 1);
                }
            }
        },
        getNextPlacementOptions(domino) {
            if (!domino) {
                return
            }
            if (this.dominosOnBoard.length === 0) {
                domino.rotate0 = false;
                domino.rotate1 = false;
                domino.placement = [0];
                return domino
            } else if (this.dominosOnBoard.length === 1) {
                let head = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                // Domino can be placed on both sides..
                if ((head.top === domino.top || head.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    domino.rotate0 = head.top === domino.top;
                    domino.rotate1 = head.top === domino.bottom;
                    domino.placement = [0, 1];
                    return domino
                }
                else if (head.top === domino.top) {
                    domino.rotate0 = true;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return domino
                } else if (head.top === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return domino
                } else if (head.bottom === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = true;
                    domino.placement = [1];
                    return domino
                } else if (head.bottom === domino.top) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [1];
                    return domino
                }
            } else {
                let tail = this.dominosOnBoard[0];
                let head = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                if ((tail.top === domino.top || tail.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    domino.rotate0 = tail.top === domino.top;
                    domino.rotate1 = head.bottom === domino.bottom;
                    domino.placement = [0, 1];
                    return domino
                }
                else if (tail.top === domino.top) {
                    domino.rotate0 = true;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return domino
                } else if (tail.top === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [0];
                    return domino
                } else if (head.bottom === domino.top) {
                    domino.rotate0 = false;
                    domino.rotate1 = false;
                    domino.placement = [1];
                    return domino
                } else if (head.bottom === domino.bottom) {
                    domino.rotate0 = false;
                    domino.rotate1 = true;
                    domino.placement = [1];
                    return domino
                }
            }
        },
        getNextDominoPlacementLocation(domino, placement) {
            if (this.dominosOnBoard.length === 0) {
                if (this.shouldPlaceDominoVertical(domino)) {
                    return {
                        x: this.boardWidth / 2 - this.dominoWidth / 2,
                        y: this.boardHeight / 2 - this.dominoHeight / 2,
                    }
                } else if (!this.shouldPlaceDominoVertical(domino)) {
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
                if (domino.location.transitionOver) {
                    this.currentTailRow++;
                    if (this.isOnMobile()) {
                        this.moveDominoDown();
                    }
                }
            } else {
                if (domino.location.transitionOver) {
                    this.currentHeadRow++;
                }
                this.dominosOnBoard.push(domino);
            }
        },
        getPlacementCoordinates(domino) {
            if (domino.location.reverse) {
                return `top:${domino.location.y}px; left: ${domino.location.x}px; transform: rotate(180deg);`;
            }
            return `top:${domino.location.y}px; left: ${domino.location.x}px;`;
        },
        isOverflowing(domino, placement) {
            if (this.dominosOnBoard.length === 0) {
                return false;
            }
            if (placement === 0) {
                if (this.currentTailRow % 2 === 0) {
                    const lastDomino = this.dominosOnBoard[0];
                    if (lastDomino.location.x - this.dominoWidth <= this.dominoHeight) {
                        return true;
                    }
                } else {
                    const lastDomino = this.dominosOnBoard[0];
                    if (lastDomino.location.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                        return true;
                    }
                }
                // Get the last played domino on the tail side
            } else {
                if (this.currentHeadRow % 2 === 0) {
                    const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1];
                    if (lastDomino.location.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
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
            if (this.shouldPlaceDominoVertical(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[0]
                if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x - this.dominoWidth,
                        y: lastDomino.location.y - this.horizontalDominoOffset,
                    }
                }
                return {
                    x: lastDomino.location.x - this.dominoWidth,
                    y: lastDomino.location.y,
                }
            } else if (!this.shouldPlaceDominoVertical(domino)) {
                // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                const lastDomino = this.dominosOnBoard[0]
                if (this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x - this.dominoHeight,
                        // We want to put it in the middle, so thats why the offset
                        y: lastDomino.location.y + this.horizontalDominoOffset,
                    }
                } else if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.location.x - this.dominoHeight,
                        y: lastDomino.location.y,
                    }
                } else {
                    return {
                        x: lastDomino.location.x - this.dominoHeight,
                        y: lastDomino.location.y,
                    }

                }
            }
        },
        getTailPlacementReverse(domino) {
            if (this.shouldPlaceDominoVertical(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[0]
                if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x + this.dominoHeight,
                        y: lastDomino.location.y - this.horizontalDominoOffset,
                        reverse: true,
                    }
                }
                return {
                    x: lastDomino.location.x + this.dominoWidth,
                    y: lastDomino.location.y,
                    reverse: true,
                }
            } else if (!this.shouldPlaceDominoVertical(domino)) {
                // We need to check if the previous one was a normal domino or a double and if it was from the same placement
                const lastDomino = this.dominosOnBoard[0]
                if (this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x + this.dominoWidth,
                        // We want to put it in the middle, so thats why the offset
                        y: lastDomino.location.y + this.horizontalDominoOffset,
                        reverse: true,
                    }
                } else if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x + this.dominoHeight,
                        y: lastDomino.location.y,
                        reverse: true,
                    }
                } else {
                    return {
                        x: lastDomino.location.x + this.dominoHeight,
                        y: lastDomino.location.y,
                        reverse: true,
                    }

                }
            }
        },
        getHeadPlacement(domino) {
            if (this.shouldPlaceDominoVertical(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x + this.dominoHeight,
                        y: lastDomino.location.y - this.horizontalDominoOffset,
                    }
                }
                return {
                    x: lastDomino.location.x + this.dominoWidth,
                    y: lastDomino.location.y - this.horizontalDominoOffset,
                }
            } else {
                // We need to check if the previous one was a normal domino or a double from the same placement
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x + this.dominoWidth,
                        y: lastDomino.location.y + this.horizontalDominoOffset,
                    }
                } else {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.location.x + this.dominoHeight,
                        y: lastDomino.location.y,
                    }
                }
            }
        },
        getHeadPlacementReverse(domino) {
            if (this.shouldPlaceDominoVertical(domino)) {
                // For the edge case where someone doesnt start with a double, we need to check if 
                // the last one was a normal one
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (!this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x - this.dominoWidth,
                        y: lastDomino.location.y - this.horizontalDominoOffset,
                        reverse: true,
                    }
                }
                return {
                    x: lastDomino.location.x - this.dominoHeight,
                    y: lastDomino.location.y - this.horizontalDominoOffset,
                    reverse: true,
                }
            } else {
                // We need to check if the previous one was a normal domino or a double from the same placement
                const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
                if (this.shouldPlaceDominoVertical(lastDomino)) {
                    return {
                        x: lastDomino.location.x - this.dominoHeight,
                        y: lastDomino.location.y + this.horizontalDominoOffset,
                        reverse: true,
                    }
                } else {
                    // Last one was not a double so we need more spacing
                    return {
                        x: lastDomino.location.x - this.dominoHeight,
                        y: lastDomino.location.y,
                        reverse: true,
                    }
                }
            }
        },
        getTailTransitioningDomino(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[0]
            if (!this.shouldPlaceDominoVertical(lastDomino)) {
                return {
                    x: lastDomino.location.x,
                    y: lastDomino.location.y - (this.dominoHeight),
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.location.x,
                y: lastDomino.location.y - this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getHeadTransitioningDomino(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            if (!this.shouldPlaceDominoVertical(lastDomino)) {
                return {
                    x: lastDomino.location.x + this.dominoHeight / 2 - 5,
                    y: lastDomino.location.y + this.dominoWidth,
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.location.x,
                y: lastDomino.location.y + this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getTailTransitioningDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[0]
            if (!this.shouldPlaceDominoVertical(lastDomino)) {
                return {
                    x: lastDomino.location.x + this.dominoWidth - 18,
                    y: lastDomino.location.y - (this.dominoHeight),
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.location.x,
                y: lastDomino.location.y - this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getHeadTransitioningDominoReverse(domino) {
            // For the edge case where someone doesnt start with a double, we need to check if 
            // the last one was a normal one
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            if (!this.shouldPlaceDominoVertical(lastDomino)) {
                return {
                    x: lastDomino.location.x,
                    y: lastDomino.location.y + this.dominoWidth,
                    forceVertical: true,
                    transitioning: true,
                }
            }
            return {
                x: lastDomino.location.x,
                y: lastDomino.location.y + this.dominoHeight,
                forceVertical: true,
                transitioning: true,
            }
        },
        getTransitionTailOverDomino(domino) {
            const lastDomino = this.dominosOnBoard[0]
            return {
                x: lastDomino.location.x + this.dominoWidth,
                y: lastDomino.location.y,
                forceHorizontal: true,
                reverse: true,
                transitionOver: true,
            }

        },
        getTransitionHeadOverDomino(domino) {
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            return {
                x: lastDomino.location.x - this.dominoHeight,
                y: lastDomino.location.y + this.dominoHeight / 2 - 10,
                forceHorizontal: true,
                transitionOver: true,
                reverse: true,
            }
        },
        getTransitionTailOverDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[0]
            return {
                x: lastDomino.location.x - this.dominoHeight,
                y: lastDomino.location.y,
                forceHorizontal: true,
                transitionOver: true,
            }
        },
        getTransitionHeadOverDominoReverse(domino) {
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1]
            return {
                x: lastDomino.location.x + this.dominoWidth,
                y: lastDomino.location.y + this.dominoHeight / 2 - 10,
                forceHorizontal: true,
                transitionOver: true,
            }
        },
        moveDominoDown() {
            const currentScroll = this.$refs.playingArea.scrollTop;
            this.dominosOnBoard.forEach((domino) => {
                domino.location.y += this.dominoHeight * 2 + 20;
            });
            this.$refs.playingArea.style = `scroll-behavior: auto;`;
            this.$refs.playingArea.scrollTo(0, currentScroll + this.dominoHeight * 2 + 20);
            setTimeout(() => {
                this.$refs.playingArea.style = `scroll-behavior: smooth;`;
            }, 100);
        },
        showChevrons() {
            const head = this.dominosOnBoard[this.dominosOnBoard.length - 1];
            const tail = this.dominosOnBoard[0];
            if (head) {
                const headElem = document.getElementById(`domino-${head.id}`);
                const cHeight = this.$refs.playingArea.clientHeight;
                const cScrollOffset = this.$refs.playingArea.scrollTop;
                const eTop = headElem.offsetTop;
                if (this.shouldPlaceDominoVertical(head)) {
                    if ((eTop + this.dominoHeight) - (cHeight - (cHeight - cScrollOffset)) >= cHeight) {
                        if (this.disableScroll) {
                            this.disableScroll = false;
                        }
                        this.showChevronDown = true;
                    } else {
                        this.showChevronDown = false;
                    }
                } else {
                    if ((eTop + this.dominoWidth) - (cHeight - (cHeight - cScrollOffset)) >= cHeight) {
                        if (this.disableScroll) {
                            this.disableScroll = false;
                        }
                        this.showChevronDown = true;
                    } else {
                        this.showChevronDown = false;
                    }
                }
            }
            if (tail) {
                const tailElem = document.getElementById(`domino-${tail.id}`);
                const cHeight = this.$refs.playingArea.clientHeight;
                const cScrollOffset = this.$refs.playingArea.scrollTop;
                const eTop = tailElem.offsetTop;
                const eBottom = eTop + tailElem.offsetHeight;
                if (this.shouldPlaceDominoVertical(tail)) {
                    if ((eBottom - this.dominoHeight) - (cHeight - (cHeight - cScrollOffset)) <= 0) {
                        if (this.disableScroll) {
                            this.disableScroll = false;
                        }
                        this.showChevronUp = true;
                    } else {
                        this.showChevronUp = false;
                    }
                } else {
                    if ((eBottom - this.dominoWidth) - (cHeight - (cHeight - cScrollOffset)) <= 0) {
                        if (this.disableScroll) {
                            this.disableScroll = false;
                        }
                        this.showChevronUp = true;

                    } else {
                        this.showChevronUp = false;
                    }
                }
            }
        },
        checkIfGameIsBlocked() {
            let headDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1];
            let tailDomino = this.dominosOnBoard[0];
            // Count if there are 7 dominos on the board with the value of head bottom
            let headCount = this.dominosOnBoard.filter(domino => domino.bottom === headDomino.bottom || domino.top === headDomino.bottom).length;
            let tailCount = this.dominosOnBoard.filter(domino => domino.bottom === tailDomino.top || domino.top === tailDomino.top).length;
            if (headCount === 7 && tailCount === 7) {
                this.$emit('on-game-blocked');
            }
        },
        isOnMobile() {
            return window.innerWidth < 768;
        },
        clearBoard() {
            this.dominosOnBoard = [];
            this.disableScroll = true;
            this.currentHeadRow = 0;
            this.currentTailRow = 0;
            this.$refs.playingArea.scrollTo(0, this.dominoWidth, "smooth");
            this.showChevronDown = false;
            this.showChevronUp = false;

        }
    },
    computed: {
        transitionTail() {
            const lastDomino = this.dominosOnBoard[0];
            const last2Dominos = this.dominosOnBoard.slice(0, 2);
            // Tranisition is done when the last 2 dominos are transitioning
            const count = last2Dominos.filter(domino => domino.location.transitioning).length;
            if (count === 2) {
                return false;
            }
            if (this.currentTailRow % 2 === 0) {
                if (lastDomino.location.x - this.dominoWidth <= this.dominoHeight + 10) {
                    return true;
                }
                return false
            }
            else if (this.currentTailRow % 2 === 1) {
                if (lastDomino.location.x + (this.dominoHeight * 2 + 20) >= this.boardWidth) {
                    return true;
                }
                return false
            }
        },
        transitionTailOver() {
            const last2Dominos = this.dominosOnBoard.slice(0, 2);
            const count = last2Dominos.filter(domino => domino.location.transitioning).length;
            if (count === 2) {
                this.reverseTail = true;
                return true;
            }
        },
        transitionHead() {
            const lastDomino = this.dominosOnBoard[this.dominosOnBoard.length - 1];
            const last2Dominos = this.dominosOnBoard.slice(this.dominosOnBoard.length - 2, this.dominosOnBoard.length);
            // Tranisition is done when the last 2 dominos are transitioning
            const count = last2Dominos.filter(domino => domino.location.transitioning).length;
            if (count === 2) {
                return false;
            }
            if (this.currentHeadRow % 2 === 0) {
                if (lastDomino.location.x + (this.dominoHeight * 2 + 40) >= this.boardWidth) {
                    return true;
                }
                return false
            }
            else if (this.currentHeadRow % 2 === 1) {
                if (lastDomino.location.x - this.dominoWidth <= this.dominoHeight) {
                    return true;
                }
                return false
            }
        },
        transitionHeadOver() {
            const last2Dominos = this.dominosOnBoard.slice(this.dominosOnBoard.length - 2, this.dominosOnBoard.length);
            const count = last2Dominos.filter(domino => domino.location.transitioning).length;
            if (count === 2) {
                this.reverseHead = true;
                return true;
            }
        }
    },
    mounted() {
        this.isMobile = window.innerWidth < 1024;
        if (this.isMobile) {
            this.dominoHeight = 64;
            this.dominoWidth = 40;
        }
        this.disableScroll = true;
        this.boardWidth = this.$refs.playingArea.clientWidth;
        this.boardHeight = this.$refs.playingArea.clientHeight + this.dominoHeight;
        this.$refs.playingArea.scrollTo(0, this.dominoWidth, "smooth");
        this.$refs.playingArea.addEventListener('scroll', () => {
            this.showChevrons();
        });
    },
    watch: {
        // When scroll bar is all the way down its hard to see that you can still play on head side. we can improve this
        // By scrolling down
        headPreviewDomino(val) {
            if (this.isOnMobile()) {
                if (val) {
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
            if (this.isOnMobile()) {
                if (val) {
                    if (!this.headPreviewDomino) {
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
        dominosOnBoard: {
            handler(newVal, oldVal) {
                setTimeout(() => {
                    this.showChevrons();
                }, 100);
                this.checkIfGameIsBlocked();
            },
            deep: true
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

@media screen and (max-width: 1024px) {
    .domino-placeholder-vertical {
        @apply h-16 w-10;
    }

    .domino-placeholder-horizontal {
        @apply h-10 w-16;
    }
}
</style>
