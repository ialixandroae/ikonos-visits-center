import React, { useContext } from "react";
import { Layout, Row, Col, Modal, Button, Image } from "antd";
import { WebMapView } from "../map/Map";
import { WebSceneView } from "../scene/Scene";
import { Panel } from "../panel/Panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import HeaderBackground from "../../media/spaceheader.jpg";
import { store } from "../../store/store";
import Loader from "react-loader-spinner";
import "./Main.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const { Header, Content } = Layout;

const HeaderStyle = {
  backgroundColor: "white",
  color: "white",
  backgroundImage: `url(${HeaderBackground})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const LeftCol = {
  height: "calc(100vh - 64px)",
};

const RightCol = {
  height: "calc(100vh - 64px)",
};

const RightUpperCol = {
  height: "calc(40vh - 32px)",
};

const RightLowerCol = {
  height: "calc(60vh - 32px)",
  backgroundColor: "white",
  overflowY: "scroll",
};

function Main() {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Layout>
      {globalState.state.modal && (
        <Modal
          style={{
            fontFamily: "Orbitron",
            // background: "linear-gradient(to right, #603867, #069cae)",
          }}
          mask={true}
          closable={false}
          visible={globalState.state.modal}
          title="CONNECTION ESTABLISHED"
          footer={[
            <Button
              style={{
                background: "linear-gradient(to right, #603867, #069cae)",
              }}
              key="submit"
              type="primary"
              onClick={() => dispatch({ type: "SET_MODAL", data: false })}
            >
              LIFT-OFF
            </Button>,
          ]}
        >
          <p>Welcome to the IKONOS Visiting Center</p>
          <p>
            This application will teleport you back in time and let you discover
            the imagery collected by IKONOS
          </p>
          <p>
            Use the 2D map and draw an area of interest, observe 0 gravity in
            the 3D world using the speed of light and blast yourself in the past
            by selecting the data you like to see
          </p>
          <p>Are you ready for earth exploration?</p>
        </Modal>
      )}
      {globalState.state.quicklookModal && (
        <Modal
          style={{
            fontFamily: "Orbitron",
            // background: "linear-gradient(to right, #603867, #069cae)",
          }}
          mask={true}
          closable={false}
          visible={globalState.state.quicklookModal}
          title="IMAGE FETCHED FROM UNIVERSE"
          footer={[
            <Button
              style={{
                background: "linear-gradient(to right, #603867, #069cae)",
              }}
              key="submit"
              type="primary"
              onClick={() =>
                dispatch({ type: "SET_QUICKLOOK_MODAL", data: false })
              }
            >
              BACK
            </Button>,
          ]}
        >
          <p>Click to enlarge it</p>
          <Image
            src={`https://ikonos.euspaceimaging.com/ordering/api/v1/ikonos/show?id=${globalState.state.quicklook}`}
            fallback="data:image/png;base64,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"
          />
        </Modal>
      )}
      {globalState.state.imageryLoading && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
            backgroundColor: "rgba(255,255,255,0.7)",
            zIndex: "9999",
          }}
        >
          <Loader
            type="RevolvingDot"
            color="#069cae"
            height={100}
            width={100}
            visible={globalState.state.imageryLoading}
            style={{
              position: "absolute",
              top: "45%",
              left: "45%",
            }}
          />
          <p
            style={{
              fontFamily: "Orbitron",
              fontWeight: "bolder",
              fontSize: "1.5rem",
              position: "absolute",
              top: "60%",
              left: "37%",
            }}
          >
            Fetching data from the universe...
          </p>
        </div>
      )}
      <Header style={HeaderStyle}>
        <span
          style={{
            float: "left",
            fontFamily: "Orbitron",
            fontWeight: "bolder",
            fontSize: "1.5rem",
          }}
        >
          IKONOS VISITS CENTER
        </span>
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            float: "right",
            fontFamily: "Orbitron",
          }}
        >
          <span style={{ marginRight: "1rem" }}>
            <a
              href="https://twitter.com/ialixandroae"
              target="_blank"
              style={{ color: "white" }}
            >
              <FontAwesomeIcon icon={faTwitter} size="1x" />
              ialixandroae
            </a>
          </span>
          <span style={{}}>
            <a
              href="https://twitter.com/euspaceimaging"
              target="_blank"
              style={{ color: "white" }}
            >
              Data provided by
              <FontAwesomeIcon
                icon={faTwitter}
                size="1x"
                style={{ marginLeft: "0.5rem" }}
              />
              EUSPACEIMAGING
            </a>
          </span>
        </span>
      </Header>
      <Layout>
        <Content>
          <Row gutter={[0, 0]}>
            <Col span={14} style={LeftCol}>
              <WebMapView />
            </Col>
            <Col span={10} style={RightCol}>
              <Row style={RightUpperCol}>
                <WebSceneView />
              </Row>
              <Row style={RightLowerCol}>
                {globalState.state.data.length === 0 ? (
                  <div>
                    <span className="stars"></span>
                    <span className="twinkling"></span>
                    <span className="clouds"></span>
                  </div>
                ) : (
                  <Panel />
                )}
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;
