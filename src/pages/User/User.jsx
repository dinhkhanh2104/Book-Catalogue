import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Row, Col, Card, Button, Modal, Input, message } from "antd";
import { db } from "../../firebase/firebase";
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
    publicationYear: null,
    rating: null,
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

  const validateName = (book) => {
    if (book.name.length > 100)
      return {
        valid: false,
        message: "Book name must be less than 100 characters.",
      };
    return { valid: true };
  };

  const validateAuthor = (book) => {
    const tmp = [""];
    if (JSON.stringify(book.author) == JSON.stringify(tmp))
      return {
        valid: false,
        message: "Book must has at least 1 author.",
      };
    else return { valid: true };
  };

  const validatePublicationYear = (book) => {
    if (book.publicationYear <= 1800)
      return {
        valid: false,
        message: "The publication year must greater than 1800",
      };
    return { valid: true };
  };

  const validateRating = (book) => {
    console.log(typeof book.rating);
    if (Number.isInteger(book.rating) && book.rating <= 10 && book.rating >= 0)
      return { valid: true };
    else
      return {
        valid: false,
        message: "Rating must be an integer between 0 and 10",
      };
  };

  const validateISBN = (book) => {
    const False = {
      valid: false,
      message: "ISBN is not valid",
    };

    const isbn = book.isbn.replace(/[-\s]/g, "");

    if (isbn.length === 10) {
      // check ISBN-10
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        let digit = isbn[i] - "0";
        if (digit < 0 || digit > 9) return False;
        sum += digit * (10 - i);
      }
      let lastDigit = isbn[9];
      if (lastDigit != "X" && (lastDigit < "0" || lastDigit > "9"))
        return False;
      sum += lastDigit == "X" ? 10 : lastDigit - "0";
      if (sum % 11 == 0) return { valid: true };
      else return False;
    } else if (isbn.length === 13) {
      // check ISBN-13
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        let digit = isbn[i] - "0";
        if (digit < 0 || digit > 9) return False;
        sum += digit * (i % 2 === 0 ? 1 : 3);
      }
      let checkDigit = isbn[12] - "0";
      if (checkDigit < 0 || checkDigit > 9) return False;
      sum += checkDigit;
      if (sum % 10 == 0) return { valid: true };
      else return False;
    } else {
      return False;
    }
  };

  const validate = (book) => {
    const validators = [
      validateName,
      validateAuthor,
      validatePublicationYear,
      validateRating,
      validateISBN,
    ];

    for (let validator of validators) {
      const result = validator(book);
      if (!result.valid) {
        message.error(result.message);
        return false;
      }
    }
    return true;
  };

  const showAddModal = () => {
    setSelectedBook(null);
    setBookFields({
      name: "",
      author: "",
      publicationYear: null,
      rating: null,
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
    const bookValidate = {
      name: bookFields.name,
      author: bookFields.author.split(", ").map((a) => a.trim()),
      publicationYear: Number(bookFields.publicationYear),
      rating: Number(bookFields.rating),
      isbn: bookFields.isbn.split("-").join(""),
      img: bookFields.img,
    };
    if (!validate(bookValidate)) return;

    if (isAdding) {
      try {
        await addDoc(collection(db, "books"), bookValidate);
        message.success("Book added successfully");
        setIsModalOpen(false);
        setIsAdding(false);
        fetchBooks();
      } catch (error) {
        message.error("Failed to add book");
        console.error("Error adding book: ", error);
      }
    } else if (selectedBook) {
      try {
        const bookRef = doc(db, "books", selectedBook.id);
        await updateDoc(bookRef, bookValidate);
        message.success("Book updated successfully");
        setIsModalOpen(false);
        setSelectedBook(null);
        fetchBooks();
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
      fetchBooks();
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
      <Header />
      <Row>
        <Col span={24}>
          <Row className="mb-5 justify-center">
            <Col span={12}>
              <div className="flex justify-end">
                <Button type="primary" className="mt-4" onClick={showAddModal}>
                  Add book
                </Button>
              </div>

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
