import { Animation } from "@hydro-sdk/hydro-sdk/runtime/flutter/animation/index";
import { BuildContext } from "@hydro-sdk/hydro-sdk/runtime/flutter/buildContext";
import {
    AnimatedListState,
    GlobalKey,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/widgets/index";

import { CardItem } from "./cardItem";

export class ListModel<E> {
    public at: (idx: number) => E = (idx: number) => {
        return this.items[idx];
    };

    public removeAt: (idx: number) => E = (idx: number) => {
        const removedItem: E = this.items.splice(idx, 1)[0];
        this.items = this.items.filter((x) => x !== null);

        if (removedItem !== null) {
            this.listKey
                .currentState()
                .removeItem(
                    idx,
                    (context: BuildContext, animation: Animation<number>) => {
                        return this.removedItemBuilder(
                            removedItem,
                            context,
                            animation
                        );
                    }
                );
        }
        return removedItem;
    };

    public insert(index: number, item: E): void {
        this.items.splice(index, 0, item);
        this.listKey.currentState().insertItem(index);
    }
    public indexOf = (item: E): number => {
        return this.items.indexOf(item);
    };
    private items: Array<E>;
    public readonly listKey: GlobalKey<AnimatedListState>;
    public removedItemBuilder: (
        item: E,
        context: BuildContext,
        animation: Animation<number>
    ) => CardItem;

    public length = (): number => {
        return this.items.length;
    };

    public constructor(props: {
        listKey: GlobalKey<AnimatedListState>;
        removedItemBuilder: (
            item: E,
            context: BuildContext,
            animation: Animation<number>
        ) => CardItem;
        initialItems: Array<E>;
    }) {
        this.listKey = props.listKey;
        this.removedItemBuilder = props.removedItemBuilder;
        this.items = props.initialItems;
    }
}
