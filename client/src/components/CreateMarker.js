import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import ReactFilestack from 'filestack-react';

class CreateMarker extends Component {

    state = {
        name: '',
        description: '',
        address: '',
        website: '',
        phone: '',
        availability: '',
        rating: [],
        url: '',
        filename: 'Image',
        error: ''
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

    onSubmit = (e) => {
        e.preventDefault();

        if (!this.state.name.length) {
            this.setState({
                error: 'Please fill in name field'
            })
        } else if (!this.state.description.length) {
            this.setState({
                error: 'Please fill in description field'
            })
        } else {
            const newMarker = {
                name: this.state.name,
                description: this.state.description,
                address: this.state.address,
                url: this.state.url,
                website: this.state.website,
                phone: this.state.phone,
                availability: this.state.availability,
                rating: [],
                lng: this.props.location.lng,
                lat: this.props.location.lat,
            }

            console.log("NEW MARKER", newMarker);
    
            this.props.location.createMarker(newMarker);

            this.setState({
                name: '',
                description: '',
                address: '',
                url: '',
                website: '',
                phone: '',
                availability: '',
                rating: [],
                error: '',
            })
        }

    }

    render() {
        return (
            <div className="container create-container">
                <Button color="secondary" onClick={()=>this.props.history.goBack()}>Go back</Button>
                <h1 className="m-3">Create Marker</h1>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" placeholder="Name of location" onChange={this.onChange} value={this.state.name} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" placeholder="Description" rows="3" onChange={this.onChange} value={this.state.description} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" placeholder="Address" onChange={this.onChange} value={this.state.address} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Website</Label>
                        <Input type="text" name="website" placeholder="Website" onChange={this.onChange} value={this.state.website} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Phone</Label>
                        <Input type="text" name="phone" placeholder="Phone Number" onChange={this.onChange} value={this.state.phone} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Availability</Label>
                        <Input type="text" name="availability" placeholder="Availability" onChange={this.onChange} value={this.state.availability} />
                    </FormGroup>
                    {/* <Button type="button" onClick={this.handleUpload}>Add Image</Button> */}
                    <FormGroup>
                        <Label for="image">{this.state.filename}</Label>{" "}
                        <ReactFilestack name="image" apikey="AQoenoDaBSJSguoAqe55Ez" onSuccess={(res) => this.onUpload(res)} />
                    </FormGroup>
                    <div>{this.state.error.length ? this.state.error : null}</div>
                    <Button color="primary" className="mt-3 w-100">Create</Button>
                </Form>
            </div>
        )
    }
}

export default CreateMarker
