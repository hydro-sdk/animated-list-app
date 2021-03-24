import { Type } from "@hydro-sdk/hydro-sdk/runtime/dart/core/index";
import { Animation } from "@hydro-sdk/hydro-sdk/runtime/flutter/animation/index";
import { BuildContext } from "@hydro-sdk/hydro-sdk/runtime/flutter/buildContext";
import {
    AppBar,
    IconButton,
    Icons,
    MaterialApp,
    Scaffold,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/material/index";
import {
    EdgeInsets,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/painting/index";
import { Widget } from "@hydro-sdk/hydro-sdk/runtime/flutter/widget";
import {
    AnimatedList,
    AnimatedListState,
    GlobalKey,
    Icon,
    Padding,
    State,
    StatefulWidget,
    Text,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/widgets/index";
import {ListModel} from "./listModel";
import {CardItem} from "./cardItem";

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

    public dispose() {}

    public initState() {}

    private buildRemovedItem = (
        item: number,
        context: BuildContext,
        animation: Animation<number>
    ): CardItem => {
        return new CardItem({
            animation: animation,
            item: item,
            selected: false,
            onTap: (): void => {},
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
