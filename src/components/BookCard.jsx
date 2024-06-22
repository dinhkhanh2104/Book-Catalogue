import React from "react";
import { Avatar, Card } from "antd";
import styles from "../styles/bookCard.module.scss";
import samplePic from "../assets/images/cleanCodeBook.jpg";
const { Meta } = Card;
function BookCard({ data }) {
  return (
    <Card
      className={styles.card}
      cover={
        <div className={styles.card__image}>
          <img alt="example" src={data.img} />
        </div>
      }
    >
      <Meta
        className={styles.card__meta}
        description={
          <div>
            <div className={styles.name}>{data.name}</div>
            <div className="flex justify-between">
              {data.publicationYear ? (
                <span>{data.publicationYear}</span>
              ) : (
                <span></span>
              )}
              {data.rating ? (
                <span>Rating: {data.rating}</span>
              ) : (
                <span>Rating: 0</span>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );
}
export default BookCard;
