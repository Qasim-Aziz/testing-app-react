import React from 'react'
import { Progress } from 'antd'
import { Helmet } from 'react-helmet'
import { LikeOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import data from './data.json'

// const { next } = Carousel;

class YouTubeFeed extends React.Component {
  state = {
    partitions: data.partitions,
  }

  // next() {
  //   this.carousel.next();
  // }

  // previous() {
  //   this.carousel.prev();
  // }

  render() {
    const { partitions } = this.state

    // const settings = {
    //   arrows: true,
    //   dots: false,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1
    // };

    return (
      <div>
        <Helmet title="Session Target" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Session Target</strong>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.feed}>
              {partitions.map(partition => (
                <div className={styles.partition} key={Math.random()}>
                  <h2 className={styles.title}>
                    {partition.cover !== undefined && (
                      <img className={`${styles.titleThumb} mr-3`} src={partition.cover} alt="" />
                    )}
                    {partition.name}
                    <a
                      href="javascript: void(0)"
                      style={{ float: 'right' }}
                      className={`${styles.headerLink} ml-4`}
                    >
                      Start Session <i className="icmn icmn-arrow-right2" />
                    </a>
                  </h2>
                  <span className={`${styles.itemViews} text-muted`}>
                    <span>30-35 Min 30 Targets</span>
                  </span>
                  <ul className={styles.partitionContent}>
                    {partition.videos.map(video => (
                      <li className={styles.item} key={Math.random()}>
                        <a href="javascript: void(0);" className={styles.itemLink}>
                          <img className={styles.itemThumb} src={video.cover} alt={video.name} />
                          <div className={styles.itemDescr}>
                            <span className={styles.itemName}>{video.name}</span>
                            <span className={styles.itemAuthor}>5 Trails Per Day</span>
                            <span className={styles.itemAuthor}>
                              <Progress percent={30} />
                            </span>
                            <span className={`${styles.itemViews} text-muted`}>
                              <span>Visual Perception </span>
                              <span style={{ float: 'right' }}>
                                1000 <LikeOutlined />
                              </span>
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default YouTubeFeed
