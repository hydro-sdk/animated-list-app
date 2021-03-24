import { Animation } from "@hydro-sdk/hydro-sdk/runtime/flutter/animation/index";
import { BuildContext } from "@hydro-sdk/hydro-sdk/runtime/flutter/buildContext";
import {
    Card,
    Colors,
    Theme,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/material/index";
import {
    Axis,
    EdgeInsets,
    TextStyle,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/painting/index";
import { HitTestBehavior } from "@hydro-sdk/hydro-sdk/runtime/flutter/rendering/index";
import { Widget } from "@hydro-sdk/hydro-sdk/runtime/flutter/widget";
import {
    Center,
    GestureDetector,
    Padding,
    SizeTransition,
    SizedBox,
    StatelessWidget,
    Text,
} from "@hydro-sdk/hydro-sdk/runtime/flutter/widgets/index";

export class CardItem extends StatelessWidget {
    public animation: Animation<number>;
    public onTap: () => void;
    public item: number;
    public selected: boolean;
    public tag = "";

    public constructor(props: {
        animation: Animation<number>;
        onTap: () => void;
        item: number;
        selected: boolean;
    }) {
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
