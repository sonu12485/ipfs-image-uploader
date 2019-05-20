import React, { Component } from "react";
import "./App.css";

import { Button, Form, Input, FormText } from "reactstrap";

import ipfs from "./ipfs";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ipfsHash: "",
      fileBuffer: null,
      loading: false
    };
  }

  onFileSelect = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        fileBuffer: Buffer(reader.result)
      });
    };
  };

  onUpload = event => {
    event.preventDefault();
    if (this.state.fileBuffer) {
      this.setState({ loading: true });
      ipfs.add(this.state.fileBuffer, (err, result) => {
        if (err) {
          console.error(err);
          this.setState({
            loading: false
          });
        } else {
          console.log(result[0]);
          this.setState({
            ipfsHash: result[0].hash,
            loading: false
          });
        }
      });
    } else {
      return;
    }
  };

  render() {
    return (
      <div className="App">
        <div className="header">IPFS - Image Uploader</div>
        <div className="App-container">
          {this.state.ipfsHash && (
            <div className="preview">
              <div className="heading">Preview Image</div>
              <div>
                <b>Save the IPFS hash to make future references</b>
                <br />
                IPFS hash of the uploaded image - <b>{this.state.ipfsHash}</b>
                <br />
                URL to access image on IPFS -{" "}
                <a
                  href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
                  target="__blank"
                >
                  "https://ipfs.io/ipfs/{this.state.ipfsHash}"
                </a>
              </div>
              <div>
                <img
                  className="preview-image"
                  src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
                  alt="preview"
                />
              </div>
            </div>
          )}
          <div className="upload">
            <div className="heading">Upload Image</div>
            <Form onSubmit={this.onUpload} style={{ padding: "10px" }}>
              <Input type="file" onChange={this.onFileSelect} />
              <FormText color="muted" style={{ padding: "10px" }}>
                The file you choose will be uploaded to IPFS &amp; a IPFS hash
                will be returned. Please store that IPFS hash to make future
                references to that image on IPFS
              </FormText>
              <Button type="submit" color="primary" style={{ padding: "10px" }}>
                Submit
              </Button>
            </Form>
          </div>
          <div className="loading">
            {this.state.loading && (
              <div>
                <img src="/img/loading.gif" alt="loading" width="200px" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
