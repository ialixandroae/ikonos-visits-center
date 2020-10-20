import React, { useContext, useEffect, useState } from "react";
import { Card, Layout, List, Avatar, Checkbox } from "antd";
import { store } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudSun,
  faSatellite,
  faSatelliteDish,
} from "@fortawesome/free-solid-svg-icons";
import imagery1 from "../../media/imagery1.jpg";
import imagery2 from "../../media/imagery2.jpg";
import imagery3 from "../../media/imagery3.jpg";

const { Content } = Layout;

const randomInteger = () => {
  return Math.floor(Math.random() * (3 - 1 + 1)) + 1;
};

export const Panel = () => {
  // console.log("Render Panel");
  const globalState = useContext(store);
  // console.log(globalState);
  const { dispatch } = globalState;
  const [imgList, setImgList] = useState([]);
  const [checkedCheckboxes, setCheckedCheckbox] = useState([]);

  const [cardTitle, setCardTitle] = useState(
    <div style={{ fontSize: "1rem" }}>Results</div>
  );
  const listData = [];

  const _setQuicklookModal = (id) => {
    dispatch({
      type: "SET_QUICKLOOK",
      data: id,
    });
    dispatch({
      type: "SET_QUICKLOOK_MODAL",
      data: true,
    });
  };

  useEffect(() => {
    if (globalState.state.data.length === 0) {
      return;
    }
    globalState.state.data.forEach((data) => {
      listData.push({
        id: data.id,
        title: `Acquisition: ${data.acquisitionDate}`,
        description: `ID: ${data.catalogID}`,
        content: `Cloud coverage: ${data.cloudCoverage} %`,
        avatar: randomInteger(),
        geometry: data.geometry,
      });
    });
    setImgList(listData);
    setCardTitle(
      <div style={{ fontSize: "0.9rem", fontFamily: "Orbitron" }}>
        You have been visited by IKONOS{" "}
        <span
          style={{ fontWeight: "bold", color: "#069cae", fontSize: "1.3rem" }}
        >
          {globalState.state.data.length}
        </span>{" "}
        times between{" "}
        {new Date(
          globalState.state.data[
            globalState.state.data.length - 1
          ].acquisitionDate
        ).getFullYear()}{" "}
        and {new Date(globalState.state.data[0].acquisitionDate).getFullYear()}
      </div>
    );
  }, [globalState.state.data]);

  return (
    <Content>
      <Card title={cardTitle}>
        <List
          itemLayout="horizontal"
          size="default"
          dataSource={imgList}
          renderItem={(item, idx) => (
            <List.Item
              key={item.id}
              extra={
                <div>
                  <Checkbox
                    style={{
                      border: "1px solid white",
                      borderRadius: "35px",
                      paddingLeft: "0.7rem",
                      paddingRight: "0.7rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      marginTop: "0.5rem",
                      background: "linear-gradient(to right, #603867, #069cae)",
                    }}
                    checked={
                      checkedCheckboxes.indexOf(idx) !== -1 ? true : false
                    }
                    onChange={(evt) => {
                      if (evt.target.checked) {
                        dispatch({
                          type: "SET_VISIBLE_IMAGERY",
                          // data: [...globalState.state.visibleImagery, item],
                          data: [item],
                        });
                        setCheckedCheckbox([idx]);
                        // dispatch({
                        //   type: "SET_SPINNER",
                        //   data: true,
                        // });
                      } else {
                        const withoutThis = globalState.state.visibleImagery.filter(
                          (_item) => _item.id !== item.id
                        );

                        setCheckedCheckbox([]);
                        dispatch({
                          type: "SET_VISIBLE_IMAGERY",
                          data: withoutThis,
                        });
                      }
                    }}
                  >
                    View data
                  </Checkbox>
                </div>
              }
              onMouseEnter={() => {
                dispatch({
                  type: "SET_VISIBLE_FOOTPRINTS",
                  data: [item],
                });
              }}
              onMouseLeave={() => {
                dispatch({
                  type: "SET_VISIBLE_FOOTPRINTS",
                  data: [],
                });
              }}
              style={{
                color: "#1b1c2e",
                fontWeight: "500",
                fontFamily: "Orbitron",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="large"
                    src={`https://ikonos.euspaceimaging.com/ordering/api/v1/ikonos/show?id=${
                      item.description.split(" ")[1]
                    }`}
                    onClick={() =>
                      _setQuicklookModal(item.description.split(" ")[1])
                    }
                    // onError={(e) => {
                    //   console.log(e);
                    //   e.target.src =
                    //     item.avatar === 1
                    //       ? imagery1
                    //       : item.avatar === 2
                    //       ? imagery2
                    //       : imagery3;
                    // }}
                  />
                }
                title={
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#1b1c2e",
                      fontWeight: "500",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSatellite}
                      size="2x"
                      style={{ marginRight: "0.5rem", color: "#603867" }}
                    />
                    {item.title}
                  </span>
                }
                // description={
                //   <div
                //     style={{
                //       fontSize: "0.81rem",
                //       color: "#1b1c2e",
                //       fontWeight: "500",
                //     }}
                //   >
                //     <FontAwesomeIcon
                //       icon={faSatelliteDish}
                //       size="2x"
                //       style={{ marginRight: "0.5rem", color: "#4e6184" }}
                //     />
                //     {item.description}
                //   </div>
                // }
                style={{ color: "#64322e" }}
              />
              <FontAwesomeIcon
                icon={faCloudSun}
                size="2x"
                style={{ marginRight: "0.5rem", color: "#069cae" }}
              />
              {item.content}
            </List.Item>
          )}
        />
      </Card>
    </Content>
  );
};
