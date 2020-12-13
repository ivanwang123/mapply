import React, { Component, useState, useEffect, useContext, useCallback } from 'react';
import MarkerModal from './MarkerModal';
import CreateMarker from './CreateMarker';
import {UserContext} from '../contexts/UserContext';
import firebase from '../config/firebaseConfig';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiaXZ3YSIsImEiOiJja2F5Ymo3NTgwYTI1MnRwaWxoYW43NmJmIn0.E02NSy7Tf4Atno3pDv6-HA';

function Map(props) {
    const {isAuthenticated} = useContext(UserContext);

    const id = props.match.params.mapID;
    const [map, setMap] = useState(null); 
    const [date, setDate] = useState(null);
    const [name, setName] = useState(''); 
    const [selectedMarker, setSelectedMarker] = useState(null); 
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    var longitude = 0;
    var latitude = 0;
    const [markers, setMarkers] = useState([]);
    const [isCreateMarker, setIsCreateMarker] = useState(false);
    const [rating, setRating] = useState(1);

    
    const closeInfo = () => {
        setSelectedMarker(null);
    }

    const redirectLogin = () => {
        props.history.push({
            pathname: '/login',
            from: `/map/${id}`
        })
    }

    const renderMarker = (doc, map) => {
        
        var marker = new mapboxgl.Marker()
            .setLngLat([doc.data().location.longitude, doc.data().location.latitude])
            .addTo(map) 

        marker.id = doc.id;

        const popupHTML = `
            ${doc.data().url ? `<img id="popup-image" src=${doc.data().url} width="208" height="117" class="img-info"></img>` : ''}
            <div class="popup-info">
                <div class="popup-name">${doc.data().name}</div>
                <div class="d-flex align-items-center mt-1">
                    <div class="mr-1">${doc.data().rating.length ? (doc.data().rating.reduce((a, b)=>a+b) / doc.data().rating.length).toFixed(1) : 'No ratings'}</div>
                    ${convertRatingToStarsDom(doc.data().rating, 16)}
                    <div class="ml-1">(${doc.data().rating.length})</div>
                </div>
                <div class="mt-1">${doc.data().description}</div>
            </div>`

        var popup = new mapboxgl.Popup({offset:35, className:"popup"})
                    .setHTML(popupHTML)
        marker.setPopup(popup);
    
        marker.getElement().addEventListener('mouseenter', () => {
            marker.togglePopup()
        })
        marker.getElement().addEventListener('mouseleave', () => {
            marker.togglePopup()
        })
        marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            setSelectedMarker(doc);
        })
        
        setMarkers(prevMarkers => [marker, ...prevMarkers])
    }

    const updateMarker = (doc) => {
        const marker = markers.filter(m => m.id === doc.id)[0];
        console.log(marker, doc.id)

        const popupHTML = `
            ${doc.data().url ? `<img id="popup-image" src=${doc.data().url} width="208" height="117" class="img-info"></img>` : ''}
            <div class="popup-info">
                <div class="popup-name">${doc.data().name}</div>
                <div class="d-flex align-items-center mt-1">
                    <div class="mr-1">${doc.data().rating.length ? (doc.data().rating.reduce((a, b)=>a+b) / doc.data().rating.length).toFixed(1) : 'No ratings'}</div>
                    ${convertRatingToStarsDom(doc.data().rating, 16)}
                    <div class="ml-1">(${doc.data().rating.length})</div>
                </div>
                <div class="mt-1">${doc.data().description}</div>
            </div>`

        marker.getPopup().setHTML(popupHTML);

        marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            setSelectedMarker(doc);
        })
    }

    const createMarker = ({name, description, address, website, phone, availability, rating, url, lng, lat}) => {
        console.log("CREATE MARKER", lng, lat)
        firebase.firestore().collection('markers').add({
            name,
            description,
            address,
            website,
            phone,
            availability,
            rating,
            url,
            location: new firebase.firestore.GeoPoint(lat, lng)
        }).then(ref => {
            ref.get().then(doc => {
                console.log("CREATE MAKRER", doc)
                firebase.firestore().collection('maps').doc(props.match.params.mapID).update({
                    markers: firebase.firestore.FieldValue.arrayUnion(doc.ref)
                })
                props.history.push('/map/'+id)
                window.location.reload();
            })
        })
    }

    useEffect(() => {
        firebase.firestore().collection('maps').doc(props.match.params.mapID).get().then(doc => {
            console.log("MAP DOC", doc.data());
            setName(doc.data().name);
            setDate(doc.data().date);

            const map = new mapboxgl.Map({
                container: 'map', 
                style: 'mapbox://styles/mapbox/streets-v11',
                center: doc.data().center ? doc.data().center : [-74.5, 40], 
                zoom: doc.data().zoom ? doc.data().zoom : 1,
                maxBounds: doc.data().topBounds ? [doc.data().botBounds, doc.data().topBounds] : null
            })
            setMap(map)

            doc.data().markers.forEach(ref => {
                ref.get().then(marker => {
                    if (marker !== null)
                        renderMarker(marker, map);
                })
            })
    
            map.on('click', (e) => {
                if (isAuthenticated) {
                    props.history.push({
                        pathname: '/create/marker',
                        createMarker: createMarker,
                        lng: longitude,
                        lat: latitude
                    });
                }
            })
    
            map.on('mousemove', (e) => {
                setLng(e.lngLat.wrap().lng);
                setLat(e.lngLat.wrap().lat);
                longitude = (e.lngLat.wrap().lng);
                latitude = (e.lngLat.wrap().lat);
            })

        })

    }, [])

    const toggleRate = () => {
        const rate = document.getElementById('rate')
        if (rate.style.display == 'flex')
            rate.style.display = 'none'
        else
            rate.style.display = 'flex'
    }

    const rateStar = (e) => {
        setRating(parseInt(e.target.id))
        for (var i = 1; i <= 5; i++) {
            document.getElementById(i).src = require('../img/empty-star.png')
        }
        for (var i = 1; i <= parseInt(e.target.id); i++) {
            document.getElementById(i).src = require('../img/full-star.png')
        }
    }

    const submitRating = () => {
        console.log(selectedMarker.id, "MAP", map);
        
        firebase.firestore().collection('markers').doc(selectedMarker.id).update({
            rating: [rating, ...selectedMarker.data().rating]
        }).then(() => {
            firebase.firestore().collection('markers').doc(selectedMarker.id).get().then(doc => {
                console.log(doc.data().rating)
                setSelectedMarker(doc);
                updateMarker(doc);
            })
        })
        toggleRate();
        
    }

    const convertRatingToStars = (ratings, size) => {
        var container = [];
        if (ratings.length) {
            var stars = Math.round((ratings.reduce((a, b)=>a+b) / ratings.length)*2)/2
            console.log("STARS", stars);
            for (var i = 1; i <= 5; i++) {
                stars -= 1;
                if (stars >= 0) {
                    container.push(<img src={require('../img/full-star.png')} width={size} height={size} />)
                } else if (stars === -0.5) {
                    container.push(<img src={require('../img/half-star.png')} width={size} height={size} />)
                } else {
                    container.push(<img src={require('../img/empty-star.png')} width={size}height={size}/>)
                }
            }   
        }
        return container
    }

    const convertRatingToStarsDom = (ratings, size) => {
        var container = '';
        if (ratings.length) {
            var stars = Math.round((ratings.reduce((a, b)=>a+b) / ratings.length)*2)/2
            console.log("STARS", stars);
            for (var i = 1; i <= 5; i++) {
                stars -= 1;
                
                if (stars >= 0) {
                    container += `<img src=${require('../img/full-star.png')} width=${size} height=${size} />`
                } else if (stars === -0.5) {
                    container += `<img src=${require('../img/half-star.png')} width=${size} height=${size} />`
                } else {
                    container += `<img src=${require('../img/empty-star.png')} width=${size} height=${size} />`
                }

            }   
        }
        return container
    }

    return (
        <div className="map-container">
            <div id="map"></div>
            <div className="position-absolute w-100 map-overlay">
                <div className="m-3 underline-button btn btn-primary" onClick={()=>props.history.push('/home')}>Return Home</div>
                <div className="m-3 ml-auto map-label badge badge-pill badge-light">Longitude: {lng.toFixed(3)}</div>
                <div className="mt-3 mr-3 ml-1 map-label badge badge-pill badge-light">Latitude: {lat.toFixed(3)}</div>
                {isAuthenticated ? <div className="m-3 map-label text-info">Click on map to create marker</div> : <div className="m-3 map-label btn btn-info" onClick={redirectLogin}>Login to create markers</div>}
            {selectedMarker ? 
            <div id="info">
                {selectedMarker.data().url ? <img src={selectedMarker.data().url} className="img-info" width="350" height="240"></img> : <div className="mt-5"></div>}
                <div className="close-info" onClick={closeInfo}>X</div>
                <h2 className="marker-name">{selectedMarker.data().name}</h2>
                <div className="marker-rate d-flex align-items-center flex-wrap">
                    <div className="mr-1">{selectedMarker.data().rating.length ? (selectedMarker.data().rating.reduce((a, b)=>a+b) / selectedMarker.data().rating.length).toFixed(1) : 'No ratings'}</div>
                        {convertRatingToStars(selectedMarker.data().rating, 24)}
                    <div className="ml-1">({selectedMarker.data().rating.length})</div>
                    <div className="w-100"></div>
                    <div className="rate-container mt-3">
                        <div className="mr-2" onClick={toggleRate}>Rate this map</div>
                        <div id="rate" style={{display:'none'}}>
                            <img id="1" onClick={rateStar} src={require('../img/full-star.png')} width="24" height="24" />
                            <img id="2" onClick={rateStar} src={require('../img/empty-star.png')} width="24" height="24" />
                            <img id="3" onClick={rateStar} src={require('../img/empty-star.png')} width="24" height="24" />
                            <img id="4" onClick={rateStar} src={require('../img/empty-star.png')} width="24" height="24" />
                            <img id="5" onClick={rateStar} src={require('../img/empty-star.png')} width="24" height="24" />
                            <div className="mr-2 badge badge-pill badge-warning" onClick={submitRating}>rate</div>
                        </div>
                    </div>

                </div>
                <div className="marker-description">{selectedMarker.data().description}</div>
                <div className="info-description">
                    {selectedMarker.data().address ? <div className="info-label">
                        <img src="https://www.gstatic.com/images/icons/material/system_gm/2x/place_gm_blue_24dp.png" className="info-icon" width="28" height="28"/>
                        <div>{selectedMarker.data().address}</div>
                    </div> : null}
                    {selectedMarker.data().website ? <div className="info-label">
                        <img src="https://www.gstatic.com/images/icons/material/system_gm/2x/public_gm_blue_24dp.png" className="info-icon" width="28" height="28"/>
                        <div>{selectedMarker.data().website}</div>
                    </div> : null}
                    {selectedMarker.data().phone ? <div className="info-label">
                        <img src="https://www.gstatic.com/images/icons/material/system_gm/2x/phone_gm_blue_24dp.png" className="info-icon" width="28" height="28"/>
                        <div>{selectedMarker.data().phone}</div>
                    </div> : null}
                    {selectedMarker.data().availability ? <div className="info-label">
                        <img src="https://www.gstatic.com/images/icons/material/system_gm/2x/schedule_gm_blue_24dp.png" className="info-icon" width="28" height="28"/>
                        <div>{selectedMarker.data().availability}</div>
                    </div> : null}
                </div>
            </div> : null}
            </div>
            {/* <MarkerModal isOpen={this.state.isMarkerModalOpen} toggle={this.toggle} createMarker={this.createMarker} lng={this.state.lng} lat={this.state.lat}/> */}
        </div>
    )
}

export default Map
