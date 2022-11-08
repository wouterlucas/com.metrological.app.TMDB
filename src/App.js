import { Utils, Router } from '@lightningjs/sdk';
import routes from "./lib/routes";
import {init as initFactory} from "./lib/factory"
import {Menu} from "./widgets"
import {Background} from "./components";
import {Protanopia, Deuteranopia, Tritanopia, ColorShift, Achromatopsia} from "./shader";
const correction = {
    Protanopia, Deuteranopia, Tritanopia, ColorShift, Achromatopsia
};

export default class App extends Router.App {
    static getFonts() {
        return [
            {family: 'Light', url: Utils.asset('fonts/Inter-Light.ttf'), descriptors: {}},
            {family: 'Regular', url: Utils.asset('fonts/Inter-Regular.ttf'), descriptors: {}},
            {family: 'Black', url: Utils.asset('fonts/Inter-Black.ttf'), descriptors: {}},
            {family: 'SemiBold', url: Utils.asset('fonts/Inter-SemiBold.ttf'), descriptors: {}},
            {family: 'Bold', url: Utils.asset('fonts/Inter-Bold.ttf'), descriptors: {}}
        ];
    }

    // when App instance is initialized we call the routes
    // this will setup all pages and attach them to there route
    _setup() {
        initFactory(this.stage);
        Router.startRouter(routes, this);
    }

    _init() {
        this.stage.on('correctColor', ({settings:{b,c,s,i}}) => {
            if(correction[s]){
                this.tag("ColorCorrection").rtt = true;
                this.tag("ColorCorrection").shader = {
                    type: correction[s], brightness: b, contrast:c
                };
            }else{
                this.tag("ColorCorrection").shader = null;
                this.tag("ColorCorrection").rtt = false;
            }
        });

    }

    static _template() {
        return {
            // we MUST spread the base-class template
            // if we want to provide Widgets.
            ColorCorrection: {
                rtt: false, w: 1920, h: 1080,
                Background: {
                    type: Background
                },
                ...super._template(),
                Widgets: {
                    Menu:{
                        type: Menu, x: 90, y: 90, zIndex: 99, visible: false, lineOffset: 24,
                        items: [
                            {label: "Movies", id: "movie", selected: true},
                            {label: "TV", id: "tv", selected: false},
                            {label: "Accessibility", id: "accessibility", selected: false}
                        ]
                    },
                    DetailsMenu:{
                        type: Menu, x: 90, y: 60, zIndex: 99, visible: false, lineOffset: 0,
                        items: [
                            {label: "About", id: "details", selected: true},
                            {label: "Cast", id: "cast", selected: false},
                            {label: "Similar", id: "similar", selected: false}
                        ]
                    },
                    PeopleMenu:{
                        type: Menu, x: 90, y: 60, zIndex: 99, visible: false, lineOffset: 0,
                        items: [
                            {label: "Biography", id: "details", selected: true},
                            {label: "Movie credits", id: "moviecredits", selected: false},
                            {label: "TV credits", id: "tvcredits", selected: false}
                        ]
                    }
                },
                Loading: {}
            }
        };
    }

    /**
     * Show app close dialogue
     * @private
     */
    _handleAppClose(){
        console.log("Close app")
    }
}
