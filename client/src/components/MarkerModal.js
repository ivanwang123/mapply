import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import ReactFilestack from 'filestack-react';

class MarkerModal extends Component {

    state = {
        name: '',
        description: '',
        address: '',
        website: '',
        phone: '',
        availability: '',
        rating: '',
        url: '',
        error: ''
    }

    // handleUpload = () => {
    //     const client = filestack.init("AQoenoDaBSJSguoAqe55Ez");
    //     const options = {
    //         transformations: {
    //             crop: false
    //         },
    //         onUploadDone: result => {
    //             console.log("RESULT", JSON.stringify(result.filesUploaded))
    //             this.setState({
    //                 url: result.filesUploaded[0].url
    //             });
    //         }
    //     }
    //     client.picker(options).open()
    // }
    onUpload = (res) => {
        console.log("UPLOAD", res);
        this.setState({
            url: res.filesUploaded[0].url
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (!this.state.name.length || !this.state.description.length) {
            this.setState({
                error: 'Please fill in all fields'
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
                lng: this.props.lng,
                lat: this.props.lat,
            }

            console.log("NEW MARKER", newMarker);
    
            this.props.createMarker(newMarker);

            this.setState({
                name: '',
                description: '',
                address: '',
                url: '',
                website: '',
                phone: '',
                availability: '',
                rating: '',
                error: '',
            })

            this.props.toggle();
        }

    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>Create Marker</ModalHeader>
                    <ModalBody>
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
                            <ReactFilestack apikey="AQoenoDaBSJSguoAqe55Ez" onSuccess={(res) => this.onUpload(res)} />
                            <br/>
                            <Button color="primary" className="mt-3">Create</Button>
                        </Form>
                        <div>{this.state.error.length ? this.state.error : null}</div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default MarkerModal
