mapboxgl.accessToken = 'pk.eyJ1IjoiaXZ3YSIsImEiOiJja2F5Ymo3NTgwYTI1MnRwaWxoYW43NmJmIn0.E02NSy7Tf4Atno3pDv6-HA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.on('click', (e) => {
    const location = e.lngLat.wrap();
    console.log(location)
    createMarker(location);
})

function renderMarker(doc) {
    var marker = new mapboxgl.Marker()
        .setLngLat([doc.data().location.latitude, doc.data().location.longitude])
        .addTo(map)

    var popup = new mapboxgl.Popup({offset:35, className:"popup"})
                .setHTML(`
                ${doc.data().url ? `<image id="popup-image" src=${doc.data().url} width="208" height="117" style="object-fit:cover;"></image>` : ''}
                <div class="popup-name">${doc.data().name}</div>`)
    marker.setPopup(popup);

    marker.getElement().addEventListener('mouseenter', () => {
        marker.togglePopup()
    })
    marker.getElement().addEventListener('mouseleave', () => {
        marker.togglePopup()
    })
    marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        $('#info').html(
            `${doc.data().url ? `<image src=${doc.data().url} width="320" height="180" style="object-fit:cover;"></image>` : ''}
            <div class="info-description">
                <h1>${doc.data().name}</h1>
                <p>${doc.data().description}</p>
                <div class="info-label">
                    <image src="/img/location_icon.png" width="28" height="28"/>
                    <div>${doc.data().address}</div>
                </div>
            </div>`
        )
    })

    console.log("MARKER", marker);
}

db.collection('markers').get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            renderMarker(doc)
        })
    })

var markers = []

function createMarker(location) {
    $('#marker-modal').modal('show')

    var url = "";
    $('#marker-form-image').on('click', (e) => {
        const client = filestack.init("AQoenoDaBSJSguoAqe55Ez");
        const options = {
            transformations: {
                crop: false
            },
            onUploadDone: result => {
                console.log("RESULT", JSON.stringify(result.filesUploaded))
                url = result.filesUploaded[0].url
            }
        }
        client.picker(options).open()
    })

    $('#marker-form-submit').on('click', (e) => {

        db.collection('markers').add({
            name: $('#marker-form-name').val(),
            description: $('#marker-form-description').val(),
            address: $('#marker-form-address').val(),
            url: url,
            location: new store.GeoPoint(location['lng'], location['lat'])
        }).then(docRef => {
            docRef.get().then(doc => {
                console.log("CREATE MAKRER", doc)
                renderMarker(doc)
            })
        })

        $('#marker-modal').modal('hide')
    })
}