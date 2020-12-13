import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import ReactFilestack from 'filestack-react';
import firebase from '../config/firebaseConfig';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiaXZ3YSIsImEiOiJja2F5Ymo3NTgwYTI1MnRwaWxoYW43NmJmIn0.E02NSy7Tf4Atno3pDv6-HA';

class CreateMap extends Component {
    
    state = {
        map: null,
        mapRef: React.createRef(),
        name: '',
        description: '',
        url: '',
        filename: 'Image',
        date: new Date(),
        action: '',
        lng: 0,
        lat: 0,
        center: [],
        bounds: [],
        zoom: 1,
        centerMarker: null,
        boundMarkerBottom: null,
        boundMarkerTop: null,
        geojson: null,
        boundsDescription: 'Set Bounds',
        centerDescription: 'Set Center',
        error: ''
        // isOpen: false
    }

    onUpload = (res) => {
        console.log("UPLOAD", res);
        this.setState({
            url: res.filesUploaded[0].url,
            filename: res.filesUploaded[0].filename
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount = () => {
        const map = new mapboxgl.Map({
            container: 'create-map', 
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [-74.5, 40], 
            zoom: this.state.zoom 
        })

        this.setState({
            map
        })

        map.on('load', function () {
            map.resize();
        });

        map.on('mousemove', (e) => {
            console.log("ZOOM", map.getZoom())
            this.setState({
                lng: e.lngLat.wrap().lng,
                lat: e.lngLat.wrap().lat
            })

            // if (this.state.geojson) {
            //     this.state.geojson.features[0].geometry.coordinates = [
            //         [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
            //         [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
            //         [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat],
            //         [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat]
            //     ]
            //     map.getSource('bounds').setData(this.state.geojson);
            //     console.log(this.state.geojson.features[0].geometry.coordinates)
            // }
        })

        map.on('wheel', () => {
            console.log("ZOOM", map.getZoom())
            this.setState({
                zoom: map.getZoom()
            })
        })

        map.on('click', (e) => {
            switch(this.state.action) {
                case 'CENTER':
                    this.setState({
                        center: [this.state.lng, this.state.lat]
                    });
                    if (this.state.centerMarker)
                        this.state.centerMarker.remove()

                    var el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundImage = 'url(https://img.icons8.com/ultraviolet/80/000000/delete-sign.png)';
                    el.style.backgroundSize = 'contain'
                    el.style.width = 24 + 'px';
                    el.style.height = 24 + 'px';

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(this.state.center)
                        .addTo(this.state.map)
                    this.setState({
                        centerMarker: marker,
                        centerDescription: 'Center Set'
                    }) 
                    break;
                case 'BOUNDS':
                    const {lng, lat} = e.lngLat.wrap();

                    if (!this.state.boundMarkerBottom) {
                        var el = document.createElement('div');
                        el.className = 'marker';
                        el.style.backgroundImage = 'url(https://cdn.filestackcontent.com/53DWTy2KS0KQ7dkQoEWV)';
                        el.style.backgroundSize = 'contain'
                        el.style.width = 32 + 'px';
                        el.style.height = 32 + 'px';

                        const bottomMarker = new mapboxgl.Marker(el, {draggable:true})
                            .setLngLat([lng, lat])
                            .addTo(this.state.map)
                        
                        bottomMarker.on('drag', (e) => {
                            this.state.geojson.features[0].geometry.coordinates = [[
                                [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat],
                                [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat]
                            ]]
                            this.state.map.getSource('bounds').setData(this.state.geojson);
                            // console.log(geojson.features[0].geometry.coordinates)
                        })

                        this.setState({
                            boundMarkerBottom: bottomMarker,
                            boundsDescription: 'Set top-right bound'
                        })
                    } else if (!this.state.boundMarkerTop) {
                        var el = document.createElement('div');
                        el.className = 'marker';
                        el.style.backgroundImage = 'url(https://cdn.filestackcontent.com/cIXb2ElUQ6Sf2nSSFTKf)';
                        el.style.backgroundSize = 'contain'
                        el.style.width = 32 + 'px';
                        el.style.height = 32 + 'px';

                        const topMarker = new mapboxgl.Marker(el, {draggable:true})
                            .setLngLat([lng, lat])
                            .addTo(this.state.map)

                        topMarker.on('drag', (e) => {
                            this.state.geojson.features[0].geometry.coordinates = [[
                                [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat],
                                [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat]
                            ]]
                            this.state.map.getSource('bounds').setData(this.state.geojson);
                            // console.log(geojson.features[0].geometry.coordinates)
                        })

                        this.setState({
                            boundMarkerTop: topMarker,
                        })

                        var geojson = {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Polygon',
                                    'coordinates': [
                                        [
                                            [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                            [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerBottom.getLngLat().lat],
                                            [this.state.boundMarkerTop.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat],
                                            [this.state.boundMarkerBottom.getLngLat().lng, this.state.boundMarkerTop.getLngLat().lat]
                                        ]
                                    ]
                                }
                            }]
                        };
    
                        this.state.map.addSource('bounds', {
                            'type': 'geojson',
                            'data': geojson
                        });
                        this.state.map.addLayer({
                            'id': 'bounds',
                            'type': 'fill',
                            'source': 'bounds',
                            'layout': {},
                            'paint': {
                                'fill-color': '#088',
                                'fill-opacity': 0.5
                            }
                        });

                        this.setState({
                            geojson: geojson,
                            boundsDescription: 'Bounds Set'
                        })
                    }
                    // const {lng, lat} = this.state.map.getCenter().wrap()
                    // var boundOffset = ( (this.state.map.getZoom()/22)*(this.state.map.getZoom()/22))
                    //  * (3-this.state.map.getZoom()/7);
                    // if (this.state.map.getZoom() < 11)
                    //     boundOffset *=3;
                    // console.log("BOUND OFFSET", boundOffset)
    
                    // console.log("SIZE", this.state.mapRef.current.offsetWidth)
                    
                    

                    
                    
                    
                    
                    
                
                break;
            }
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        var botBounds = [];
        var topBounds = [];
        if (this.state.boundMarkerBottom && this.state.boundMarkerTop) {
            const {lng: botLng, lat: botLat} = this.state.boundMarkerBottom.getLngLat();
            const {lng: topLng, lat: topLat} = this.state.boundMarkerTop.getLngLat();
            botBounds = [botLng, botLat];
            topBounds = [topLng, topLat];
        }

        if (!this.state.name.length) {
            this.setState({
                error: 'Please fill in the name field'
            })
        } else if (!this.state.description.length) {
            this.setState({
                error: 'Please fill in the description field'
            })
        } else if (!this.state.centerMarker) {
            this.setState({
                error: 'Please set a center for the map'
            })
        } else {
            const newMap = {
                name: this.state.name,
                description: this.state.description,
                url: this.state.url,
                date: this.state.date,
                center: this.state.center,
                botBounds: botBounds.length ? botBounds : null,
                topBounds: topBounds.length ? topBounds : null,
                zoom: this.state.zoom,
                markers: [],
            }
    
            firebase.firestore().collection('maps').add(newMap).then(ref => {
                this.props.history.push('/home');
                window.location.reload();
            });
        }
    }

    render() {
        return (
            <div className="container create-container">
                <Button className="secondary" onClick={()=>this.props.history.push('/home')}>Go back</Button>
                <h1 className="m-3">Create Map</h1>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" placeholder="Name of map" onChange={this.onChange} value={this.state.name} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" placeholder="Description" rows="3" onChange={this.onChange} value={this.state.description} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="image">{this.state.filename}</Label>{" "}
                        <ReactFilestack className="primary file-button" name="image" apikey="AQoenoDaBSJSguoAqe55Ez" onSuccess={(res) => this.onUpload(res)} />
                    </FormGroup>
                    
                    <div className="mt-4 mb-4">
                        <div id="create-map" ref={this.state.mapRef}></div>
                        <div className="d-flex align-items-center">
                            <Button color="warning mt-2" type="button" onClick={()=>this.setState({action:'CENTER'})}>{this.state.centerDescription}</Button>
                            <Button color="warning mt-2 ml-3" type="button" onClick={()=>this.setState({action:'BOUNDS', boundsDescription:'Set bottom-left bound'})}>{this.state.boundsDescription}</Button>
                            <div className="ml-3">Zoom: {this.state.zoom}</div>
                        </div>
                    </div>
                    <div>{this.state.error}</div>
                    <Button color="primary" className="w-100 ml-auto mr-auto">Create</Button>
                </Form>
            </div>
        )
    }
}

export default CreateMap
