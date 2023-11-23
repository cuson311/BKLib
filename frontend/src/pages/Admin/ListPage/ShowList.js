
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from "axios";
import Forms from '../../../components/AddBooks/Addbooks'
import Modal from 'react-bootstrap/Modal';
import Pagination from "../../../components/Pagination/Pagination";
import SearchBox from "../../../components/Search/Search";


const ShowList = () => {




    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [updateBooks, setUpdateBooks] = useState(false);




    // # Show Popup 
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    // ----------------------------------------------------------------
    useEffect(() => {
        axios.get('http://localhost:3001/books')
            .then(res => {
                setBooks(res.data)
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/books');
                // console.log(response.data)
                const sortedBooks = response.data.sort((a, b) => {
                    // Sắp xếp theo thời gian thêm mới giảm dần
                    console.log("Date:", new Date(b.dateAdded) - new Date(a.dateAdded))
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                });

                console.log("Log:", sortedBooks)
                setBooks(sortedBooks);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        // Fetch lại danh sách khi state updateBooks thay đổi
        fetchBooks();
    }, [updateBooks]);

    const handleDelete = (bookId) => {
        console.log(`Delete book with ID ${bookId}`);
    }


    const [searchKeyword, setSearchKeyword] = useState('');

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleSearch = (keyword) => {
        setCurrentPage(1); // Reset trang về 1 khi bắt đầu tìm kiếm mới
        const searchString = keyword.toString().toLowerCase();
        setSearchKeyword(searchString);
    };

    const filteredBooks = books.filter((book) =>
        Object.values(book).some((value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchKeyword.toLowerCase())
        )
    );

    const totalFilteredResults = filteredBooks.length;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const totalPages = Math.ceil(totalFilteredResults / itemsPerPage);


    const displayedBooks = filteredBooks.slice(startIndex, endIndex);


    // Callback này được gọi khi sách được thêm mới thành công
    const handleBookAdded = () => {
        // Đóng modal thêm sách (nếu bạn muốn đóng)
        // handleClose();
        // Gọi hàm để cập nhật danh sách sau khi thêm sách
        setUpdateBooks(prevState => !prevState);
    };

    const [editBook, setEditBook] = useState(null);


    const handleEdit = (bookId) => {
        console.log("Editing book with ID:", bookId);
        const bookToEdit = books.find((book) => book.ISBN === bookId);
        console.log("Book to edit:", bookToEdit);
        const bookWithDefaults = {
            ...bookToEdit,
            image: bookToEdit.image || null,
            genres: bookToEdit.genres || [],
        };
        console.log("Book to edit:", bookWithDefaults);
        setEditBook(bookWithDefaults);


        handleShow(); // Open the modal for editing
    };






    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }



    return (
        <div>
            <Row>
                <strong style={{ fontSize: "55px", fontWeight: "700" }}>Quản lý danh sách của thư viện</strong>
            </Row>
            <Row style={{ width: "100%", marginTop: "15px" }}>
                <Col xs={6}>
                    <SearchBox onSearch={handleSearch} />
                </Col>
                <Col xs={4} style={{ display: "flex" }}>
                    <Button variant="outlined" color="success" style={{ width: "80px", marginRight: "20px" }}>Search</Button>
                </Col>
                <Col xs={2} style={{ display: "flex", textAlign: "right", justifyContent: "right" }} >
                    <Button onClick={handleShow} variant="contained" color="success" style={{ width: "120px" }}>Thêm sách</Button>
                </Col>
            </Row>

            <Row style={{ width: "105%", marginTop: "30px" }}>
                <TableContainer component={Paper} style={{ border: "3px solid grey" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#EEEEEE', textAlign: 'center', padding: '2px' }}>
                                <TableCell align="center">ISBN</TableCell>
                                <TableCell align="center">Tiêu đề</TableCell>
                                <TableCell align="center">Tác giả</TableCell>
                                <TableCell align="center">Nhà xuất bản</TableCell>
                                <TableCell align="center">Ngày thêm sách</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedBooks.map((book) => (
                                <TableRow key={book.ISBN}>
                                    <TableCell style={{ padding: '5px' }} align="center">{book.ISBN}</TableCell>
                                    <TableCell style={{ padding: '5px', width: '230px' }} align="center">{book.title}</TableCell>
                                    <TableCell style={{ padding: '5px' }} align="center">{book.authorName}</TableCell>
                                    <TableCell style={{ padding: '5px' }} align="center">{book.publisher}</TableCell>
                                    <TableCell style={{ padding: '5px' }} align="center">{book.publishDate}</TableCell>
                                    <TableCell style={{ padding: '5px', width: '230px' }} align="center" >
                                        <Button style={{ padding: '5px', marginRight: '15px' }} variant="outlined" color="success" size="small" onClick={() => handleEdit(book.ISBN)}>Chỉnh sửa</Button>
                                        <Button style={{ padding: '5px' }} variant="outlined" color="error" size="small" onClick={() => handleDelete(book.id)}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Row>
            <Col xs={12} style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
            </Col>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '160px' }} > {editBook ? 'Chỉnh sửa sách' : 'Thêm sách'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Forms onBookAdded={handleBookAdded} editBook={editBook} />
                </Modal.Body>
            </Modal>
        </div >
    )
}


export default ShowList;
