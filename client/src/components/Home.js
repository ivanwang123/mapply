import React, { Component, useContext, useState, useEffect } from 'react';
import firebase from '../config/firebaseConfig';
import {UserContext} from '../contexts/UserContext';
import {Button} from 'reactstrap';
import Navbar from './Navbar';

function Home(props) {
    const [maps, setMaps] = useState([]);
    const {user, isAuthenticated} = useContext(UserContext);

    useEffect(() => {
        // document.body.style.overflowY="auto"
        firebase.firestore().collection('maps').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                let mapData = {};

                mapData.id = doc.id;
                mapData.name = doc.data().name;
                mapData.date = doc.data().date.toDate();
                mapData.description = doc.data().description;
                mapData.url = doc.data().url;
                mapData.markers = [];

                let markers = doc.data().markers.map(ref => {
                    return ref.get().then(markerSnap => {
                        mapData.markers.push(markerSnap.data());
                    })
                })
                Promise.all(markers).then(() => {
                    setMaps(maps => [mapData, ...maps])
                })
            })
        })
    }, [])

    const logout = () => {
        firebase.auth().signOut(); 
    }

    const sortedMaps = maps.sort((a, b) => b.date - a.date)

    return (
        <div>
            <Navbar />

            <div className="map-feed">
                <div className="w-100 d-flex">
                {isAuthenticated ? 
                    <button className="create-button btn btn-info" onClick={()=>props.history.push('/create/map')}>+ Create Map</button>
                : 
                    <div className="create-button text-info">Login to create maps</div>}
                </div> 
                {sortedMaps.length ? sortedMaps.map(map => {
                    console.log("URL", map)
                    return (
                        <div className="ml-4 mr-4 map-display" onClick={()=>props.history.push(`/map/${map.id}`)}>
                            {/* <img src={map.url} className="display-img" /> */}
                            {map.url ? <img src={map.url} className="display-img" /> : <img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/map-of-the-world-map-michael-tompsett.jpg" className="display-img" />}
                            <div className="display-info">
                                <div className="name">{map.name}</div>
                                {/* <p className="date">{map.date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</p> */}
                                <div className="description mb-2">{map.description}</div>
                                <div className="place-list text-muted"> 
                                    Locations ({map.markers.length}) {map.markers.length ? ':' : ''}
                                    {map.markers.slice(0, 3).map((marker, index) => {
                                        return (
                                            <div className=" ml-2 text-muted">{marker.name}{index === 2 ? '...' : ','}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                }) : null}
            </div>
        </div>
    )
}

export default Home
