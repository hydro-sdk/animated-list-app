import { Type } from "@hydro-sdk/hydro-sdk/runtime/dart/core/index";
import { Animation } from "@hydro-sdk/hydro-sdk/runtime/flutter/animation/index";
import { BuildContext } from "@hydro-sdk/hydro-sdk/runtime/flutter/buildContext";
import { Text, AnimatedListState, GlobalKey, Icon, State, StatefulWidget, Padding, AnimatedList, StatelessWidget, SizeTransition, GestureDetector, SizedBox, Center } from "@hydro-sdk/hydro-sdk/runtime/flutter/widgets/index";
import { AppBar, Card, Colors, IconButton, Icons, MaterialApp, Scaffold, Theme } from "@hydro-sdk/hydro-sdk/runtime/flutter/material/index";
import { Widget } from "@hydro-sdk/hydro-sdk/runtime/flutter/widget";
import { EdgeInsets, Axis, TextStyle } from "@hydro-sdk/hydro-sdk/runtime/flutter/painting/index";
import { HitTestBehavior } from "@hydro-sdk/hydro-sdk/runtime/flutter/rendering/index";


export class AnimatedListSample extends StatefulWidget {
    public createState(): _AnimatedListSampleState {
        return new _AnimatedListSampleState();
    }
}

class _AnimatedListSampleState extends State<AnimatedListSample> {
    private listKey: GlobalKey<AnimatedListState>;
    private list: ListModel<number>;
    private selectedItem: number | null = null;
    private nextItem = 3;

    public constructor() {
        super();
        this.listKey = new GlobalKey<AnimatedListState>(
            new Type(AnimatedListState)
        );
        this.list = new ListModel<number>({
            listKey: this.listKey,
            initialItems: [0, 1, 2],
            removedItemBuilder: this.buildRemovedItem,
        });
    }

    public dispose() { }

    public initState() { }

    private buildRemovedItem = (
        item: number,
        context: BuildContext,
        animation: Animation<number>
    ): CardItem => {
        return new CardItem({
            animation: animation,
            item: item,
            selected: false,
            onTap: (): void => { },
        });
    };

    private buildItem = (
        context: BuildContext,
        index: number,
        animation: Animation<number>
    ): CardItem => {
        return new CardItem({
            animation: animation,
            item: this.list.at(index),
            selected: this.selectedItem == this.list.at(index),
            onTap: (): void => {
                this.setState(() => {
                    this.selectedItem =
                        this.selectedItem == this.list.at(index)
                            ? null
                            : this.list.at(index);
                });
            },
        });
    };

    private insert: () => void = () => {
        let index = 0;
        if (this.selectedItem == null) {
            index = this.list.length();
        } else {
            index = this.list.indexOf(this.selectedItem);
        }
        if (index > this.list.length()) {
            index = 0;
        }

        this.list.insert(index, this.nextItem++);
    };

    private remove: () => void = () => {
        if (this.selectedItem !== null) {
            this.list.removeAt(this.list.indexOf(this.selectedItem));
            this.setState(() => {
                this.selectedItem = null;
            });
        }
    };

    public build(): MaterialApp {
        return new MaterialApp({
            initialRoute: "/",
            home: new Scaffold({
                appBar: new AppBar({
                    title: new Text("AnimatedList"),
                    actions: [
                        new IconButton({
                            icon: new Icon(Icons.add_circle),
                            onPressed: (): void => this.insert(),
                            tooltip: "insert a new item",
                        }),
                        new IconButton({
                            icon: new Icon(Icons.remove_circle),
                            onPressed: (): void => this.remove(),
                            tooltip: "remove the selected item",
                        }),
                    ],
                }),
                body: new Padding({
                    padding: EdgeInsets.all(16.0),
                    child: new AnimatedList({
                        key: this.listKey,
                        initialItemCount: this.list.length(),
                        itemBuilder: (
                            context: BuildContext,
                            num: number,
                            anim
                        ): Widget => {
                            return this.buildItem(context, num, anim);
                        },
                    }),
                }),
            }),
        });
    }
}

class ListModel<E> {
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

export interface CardItemProps {
    animation: Animation<number>;
    onTap: () => void;
    item: number;
    selected: boolean;
}

class CardItem extends StatelessWidget {
    public animation: Animation<number>;
    public onTap: () => void;
    public item: number;
    public selected: boolean;
    public tag = "";

    public constructor(props: CardItemProps) {
        super();
        this.animation = props.animation;
        this.onTap = props.onTap;
        this.item = props.item;
        this.selected = props.selected;
    }

    public build(context: BuildContext): Widget {
        let textStyle: TextStyle = Theme.of(context).textTheme.display1;
        if (this.selected) {
            textStyle = textStyle.copyWith({
                color: Colors.lightGreenAccent.swatch[400],
            });
        }

        return new Padding({
            padding: EdgeInsets.all(2.0),
            child: new SizeTransition({
                axis: Axis.vertical,
                sizeFactor: this.animation,
                child: new GestureDetector({
                    behavior: HitTestBehavior.opaque,
                    onTap: (): void => {
                        this.onTap();
                    },
                    child: new SizedBox({
                        height: 128,
                        child: new Card({
                            color:
                                Colors.primaries[
                                    this.item % Colors.primaries.length
                                ].swatch[500],
                            child: new Center({
                                child: new Text(`Item ${this.item}`, {
                                    style: textStyle,
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        });
    }
}
