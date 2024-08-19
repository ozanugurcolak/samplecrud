import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Crud = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [isActive, setIsActive] = useState(0)

    const [editId, setEditId] = useState('')
    const [editName, setEditName] = useState('')
    const [editAge, setEditAge] = useState('')
    const [editIsActive, setEditIsActive] = useState(0)


    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('https://localhost:44328/api/Employee')
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:44328/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditAge(result.data.age);
                setEditIsActive(result.data.isActive);
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this employee?")) {
            axios.delete(`https://localhost:44328/api/Employee/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('employee has been deleted')
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error)
                })
        }
    }

    const handleUpdate = () => {
        const url = `https://localhost:44328/api/Employee/${editId}`
        const data = {
            "id" : editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url, data)
            .then((result) => {
                handleClose()
                getData();
                clear();
                toast.success('employee has been uptaded');
            }).catch((error) => {
                toast.error(error)
            })
    }

    const handleSave = () => {
        const url = 'https://localhost:44328/api/Employee'
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('employee has been added');
            }).catch((error) => {
                toast.error(error)
            })
    }

    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditName('');
        setEditIsActive(0);
        setEditId('');
    }

    const handleActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1)
        }
        else {
            setIsActive(0)
        }
    }
    const handleEditActiveChange = (e) => {
        if (e.target.checked) {
            setEditIsActive(1)
        }
        else {
            setEditIsActive(0)
        }
    }

    return (
        <div style={{ marginTop: '20px' }}> {/* Üstten boşluk ekliyoruz */}
            <ToastContainer />
            <Container>
                <Row className="align-items-center mb-4"> {/* Daha iyi hizalama ve alt boşluk ekleme */}
                    <Col md={4}>
                        <div className="form-group">
                            <input type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="form-group">
                            <input type="text"
                                className="form-control"
                                placeholder="Enter Age"
                                value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                    </Col>
                    <Col md={2} className="d-flex align- items-center"> {/* Checkbox hizalaması */}
                        <div className="form-check">
                            <input type="checkbox"
                                className="form-check-input"
                                id="isActiveCheck"
                                checked={isActive === 1 ? true : false}
                                onChange={(e) => handleActiveChange(e)}
                                value={isActive} />
                            <label className="form-check-label"
                                htmlFor="isActiveCheck">IsActive</label>
                        </div>
                    </Col>
                    <Col md={2}>
                        <Button className="btn btn-primary w-100" onClick={() => handleSave()}>Submit</Button>
                    </Col>
                </Row>
            </Container>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>{item.isActive}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleEdit(item.id)} className="me-2">Edit</Button> {/* Boşluk için Bootstrap margin-end */}
                                <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                            </td>
                        </tr>
                    )) : 'Loading...'}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify / Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={4}>
                            <div className="form-group">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Enter Age"
                                    value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                            </div>
                        </Col>
                        <Col md={2} className="d-flex align-items-center"> {/* Checkbox hizalaması */}
                            <div className="form-check">
                                <input type="checkbox"
                                    className="form-check-input"
                                    id="isActiveCheck"
                                    checked={editIsActive === 1 ? true : false}
                                    onChange={(e) => handleEditActiveChange(e)}
                                    value={editIsActive} />
                                <label className="form-check-label"
                                    htmlFor="isActiveCheck">IsActive</label>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Crud;
