import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";
import Navbar from "./Navbar.js";
import Loader from "./Loader.js";

export default class Api extends Component{
    constructor(props, children) {
        super(props, children);
        this.initState({
            'api' : [],
            'item-sw': []
        })
    }

    callApi(){
        let input = document.getElementById('url');
        let loader = document.getElementById('loader-item');
        let select = document.getElementById('choice');
        if (select){
            select.setAttribute('disabled', 'disabled');
        }
        loader.style.display = "block";
        fetch('https://swapi.co/api/'+ input.value).then(function (response) {
            if (response.ok){
                loader.style.display = "none";
                return response.json().then(function (data) {
                    return data;
                });
            }
        }).then( (data) => {
            this.setState({ 'api' : data});
        }).catch(function (error) {
            console.log(error);
        });
    }

    onChange(type = 'undefined'){
        if (type === "api")
            return () => {this.callApi()};
        else
            return () => {this.showData()};
    }

    showData(){
        let select = document.getElementById('choice');
        this.setState({'item-sw': this.getState('api').results[select.value]});
    }

    render() {

        let select, card = null;

        if (this.getState('api').hasOwnProperty('results')){
            select = Zouav.createElement('select', {
                'id': 'choice',
                'class': 'form-control mt-3',
                'event' : {'change': this.onChange()}
            }, this.getState('api').results.map((item, index) => {
                return Zouav.createElement('option', {'value': index}, item.name);
            }));

            if (this.getState('item-sw')){
                let item = this.getState('item-sw');
                let properties = Object.getOwnPropertyNames(item);
                card = Zouav.createElement("div", {"class": "card mt-3"}, [
                    Zouav.createElement('div', {'class' : 'card-body'}, [
                        properties.map((name) => {
                            if (name === "length" && item[name] === 0)
                                return Zouav.createElement('div',{}, "");
                            return Zouav.createElement('p',{}, `${name.toUpperCase()} : ${item[name]}`);
                        })
                    ])
                ]);
            }
        }

        return Zouav.createElement('div', {}, [
            Zouav.createElement(Navbar, {}, []),
            Zouav.createElement('div', {'class': 'container mt-3'}, [
                Zouav.createElement('h1', {'class': 'text-center mb-3'}, 'Star wars'),
                Zouav.createElement('div', {'class': 'card'}, [
                    Zouav.createElement('div', {'class': 'card-body'}, [
                        Zouav.createElement('select',{
                            'type':'text',
                            'id': 'url',
                            'class': 'form-control',
                            'event' : {'change': this.onChange("api")}
                        },[
                            Zouav.createElement('option', {'selected': 'selected'}, 'Select...'),
                            Zouav.createElement('option', {'value': 'people'}, 'Personnages'),
                            Zouav.createElement('option', {'value': 'planets'}, 'Planetes'),
                            Zouav.createElement('option', {'value': 'starships'}, 'Vaisseaux'),
                        ]),
                        Zouav.createElement(Loader, {'class': 'sk-chase', 'id': 'loader-item'}, []),
                        (select) ? select : Zouav.createElement('div', {}, ''),
                    ]),
                ]),
                (card) ? card : Zouav.createElement('div', {}, '')
            ]),
        ]);
    }
}
