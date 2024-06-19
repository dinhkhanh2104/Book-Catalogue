import { Col, Row, Card, Select } from "antd";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import BookCard from "../../components/BookCard";
import styles from "../../styles/home.module.scss";
function Home() {
  const [filter, setFilter] = useState("publicationYear");
  const [books, setBooks] = useState([]);
  const [recommend, setRecommend] = useState();

  const handleSelectChange = (value) => {
    setFilter(value);
  };

  const handleGroup = (items, getType, sortFn) => {
    return Object.entries(
      items.reduce((acc, item) => {
        const type = getType(item);
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {})
    )
      .sort(sortFn)
      .map(([key, value]) => ({
        case: key,
        items: value,
      }));
  };

  useEffect(() => {
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
        // sort by alphabet
        fetchedBooks.sort((a, b) => a.name.localeCompare(b.name));
        setBooks(fetchedBooks);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    handleRecommend();
  }, [books]);

  const renderBooks = () => {
    let groupedBooks = [];
    switch (filter) {
      case "publicationYear": {
        groupedBooks = handleGroup(
          books,
          (item) => item.publicationYear,
          ([a], [b]) => {
            if ([a] == "undefined") return 1;
            if ([b] == "undefined") return -1;
            return b - a;
          }
        );
        break;
      }
      case "rating":
        groupedBooks = handleGroup(
          books,
          (item) => item.rating,
          ([a], [b]) => {
            if ([a] == "undefined") return 1;
            if ([b] == "undefined") return -1;
            return b - a;
          }
        );
        break;
      case "author":
        books.sort((a, b) => a.author[0].localeCompare(b.author[0]));
        groupedBooks = handleGroup(
          books,
          (item) => item.author.join(", "),
          ([a], [b]) => a.localeCompare(b)
        );
        break;
    }

    return groupedBooks.map((data) => (
      <Card key={data.case} className="mt-8">
        {data.case == "undefined" ? (
          filter == "publicationYear" ? (
            <p className="text-lg font-semibold">
              Book without publication year
            </p>
          ) : (
            <p className="text-lg font-semibold">Rating: 0</p>
          )
        ) : (
          <p className="text-lg font-semibold">
            {filter.charAt(0).toUpperCase() + filter.slice(1)}: {data.case}
          </p>
        )}
        <Row className="mt-8">
          {data.items.map((book) => (
            <Col span={6} className="" key={book.id}>
              <BookCard data={book} />
            </Col>
          ))}
        </Row>
      </Card>
    ));
  };

  const handleRecommend = () => {
    const currentYear = new Date().getFullYear();
    const bookFilter = books.filter(
      (book) => currentYear - book.publicationYear >= 3
    );
    let maxRating = bookFilter[0];
    bookFilter.forEach((book) => {
      if (book.rating > maxRating.rating) maxRating = book;
    });
    // console.log(bookFilter);
    const resultArray = bookFilter.filter(
      (book) => book.rating == maxRating.rating
    );
    const randomIndex = Math.floor(Math.random() * resultArray.length);
    const result = resultArray[randomIndex];

    setRecommend(result);
  };
  // console.log(recommend.img);

  return (
    <Row>
      <Col span={24}>
        <Row className="flex justify-center">
          <Col span={20}>
            <Card>
              <Card>
                <p className="font-semibold text-lg">Recommend book</p>
                <Row className="mt-8">
                  <Col span={12} className="flex justify-center">
                    <div className="w-[200px]">
                      <img src={recommend?.img} alt="recommend book" />
                    </div>
                  </Col>
                  <Col span={12} className="flex items-center overflow-hidden">
                    <div className="flex flex-col gap-5 text-xl font-semibold">
                      <span className=" text-3xl mb-3">{recommend?.name}</span>
                      <span className="">
                        Author:{"  "}
                        <span className="text-[#007185]">
                          {recommend?.author.join(" ,")}
                        </span>
                      </span>
                      {recommend?.publicationYear ? (
                        <span>
                          Publication year:{"  "}
                          <span className="text-[#565959]">
                            {recommend.publicationYear}
                          </span>
                        </span>
                      ) : (
                        <span>Publication Year: Updating...</span>
                      )}
                      {recommend?.rating ? (
                        <span>
                          Rating:{"  "}
                          <span className="text-[#ffa41c]">
                            {recommend.rating}
                          </span>
                        </span>
                      ) : (
                        <span>Rating: Updating...</span>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card>
                <div className="flex gap-3 justify-end">
                  <label className="flex items-center">Group by</label>
                  <Select
                    onChange={handleSelectChange}
                    value={filter}
                    style={{
                      width: 180,
                    }}
                    options={[
                      {
                        value: "publicationYear",
                        label: "Publication Year",
                      },
                      {
                        value: "rating",
                        label: "Rating",
                      },
                      {
                        value: "author",
                        label: "Author",
                      },
                    ]}
                  />
                </div>

                {renderBooks()}
              </Card>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Home;
