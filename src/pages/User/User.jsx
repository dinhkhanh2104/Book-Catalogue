import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Row, Col, Card, Button, Modal, Input, message } from "antd";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const User = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [bookFields, setBookFields] = useState({
    name: "",
    author: "",
    publicationYear: "",
    rating: "",
    isbn: "",
    img: "",
  });

  const fields = [
    { label: "Tên sách", name: "name", placeholder: "Book Name" },
    { label: "Tác giả", name: "author", placeholder: "Author" },
    {
      label: "Năm xuất bản",
      name: "publicationYear",
      placeholder: "Publication Year",
    },
    { label: "Đánh giá", name: "rating", placeholder: "Rating" },
    { label: "ISBN", name: "isbn", placeholder: "ISBN" },
    { label: "Image URL", name: "img", placeholder: "Image URL" },
  ];

  const showAddModal = () => {
    setSelectedBook(null);
    setBookFields({
      name: "",
      author: "",
      publicationYear: "",
      rating: "",
      isbn: "",
      img: "",
    });
    setIsAdding(true);
    setIsModalOpen(true);
  };
  const showEditModal = (book) => {
    setSelectedBook(book);
    setBookFields({
      name: book.name,
      author: book.author.join(", "),
      publicationYear: book.publicationYear,
      rating: book.rating,
      isbn: book.isbn,
      img: book.img,
    });
    setIsModalOpen(true);
  };
  const showDeleteModal = (bookId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this book?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(bookId),
    });
  };
  const handleOk = async () => {
    if (isAdding) {
      try {
        // validate here
        await addDoc(collection(db, "books"), {
          name: bookFields.name,
          author: bookFields.author.split(", ").map((a) => a.trim()),
          publicationYear: bookFields.publicationYear,
          rating: bookFields.rating,
          isbn: bookFields.isbn,
          img: bookFields.img,
        });
        message.success("Book added successfully");
        setIsModalOpen(false);
        setIsAdding(false);
        fetchBooks(); // Re-fetch books to update the list
      } catch (error) {
        message.error("Failed to add book");
        console.error("Error adding book: ", error);
      }
    } else if (selectedBook) {
      try {
        const bookRef = doc(db, "books", selectedBook.id);
        await updateDoc(bookRef, {
          name: bookFields.name,
          author: bookFields.author.split(", ").map((a) => a.trim()),
          publicationYear: bookFields.publicationYear,
          rating: bookFields.rating,
          isbn: bookFields.isbn,
          img: bookFields.img,
        });
        message.success("Book updated successfully");
        setIsModalOpen(false);
        setSelectedBook(null);
        fetchBooks(); // Re-fetch books to update the list
      } catch (error) {
        message.error("Failed to update book");
        console.error("Error updating book: ", error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setIsAdding(false);
  };
  const handleDelete = async (bookId) => {
    try {
      await deleteDoc(doc(db, "books", bookId));
      message.success("Book deleted successfully");
      fetchBooks(); // Re-fetch books to update the list
    } catch (error) {
      message.error("Failed to delete book");
      console.error("Error deleting book: ", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookFields({
      ...bookFields,
      [name]: value,
    });
  };

  const fetchBooks = async () => {
    const colRef = collection(db, "books");
    try {
      const data = await getDocs(colRef);
      let fetchedBooks = [];
      data.forEach((doc) => {
        fetchedBooks.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      fetchedBooks.sort((a, b) => a.name.localeCompare(b.name));
      setBooks(fetchedBooks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <Header name={"Book Catalogue User"} />
      <Row>
        <Col span={24}>
          <Row justify="center">
            <Col span={12}>
              <Button type="primary" className="mt-4" onClick={showAddModal}>
                Thêm sách
              </Button>
              {books.map((book) => (
                <Card key={book.id} className="mt-4">
                  <div className="flex justify-between items-center">
                    <p>{book.name}</p>
                    <div className="flex gap-9">
                      <Button
                        className="w-[40px]"
                        type="primary"
                        onClick={() => showEditModal(book)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        className="w-[40px] bg-red-600 hover:!bg-red-500"
                        type="primary"
                        onClick={() => showDeleteModal(book.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title={isAdding ? "Add Book" : "Edit Book"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {(isAdding || selectedBook) && (
          <div>
            {fields.map((field) => (
              <div key={field.name} className="flex gap-4 items-center mb-2">
                <label
                  className="w-[140px] text-base cursor-pointer"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <Input
                  name={field.name}
                  id={field.name}
                  value={bookFields[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            {bookFields.img && (
              <div className="flex justify-center mb-2">
                <img
                  src={bookFields.img}
                  alt="Look like your url is incorrect"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default User;
