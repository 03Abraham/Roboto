import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Input, Modal } from 'antd';
const { Meta } = Card;
const Robotlist = () => {
  const [initialRobots, setInitialRobots] = useState([]);
  const [robots, setRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const fetchInitialRobots = useCallback(async () => {
    try {
      const result = await axios('https://jsonplaceholder.typicode.com/users');
      const robotList = result.data.map((robot) => ({
        id: robot.id,
        name: robot.name,
        description: robot.company.catchPhrase,
        image: `https://robohash.org/${robot.username}?set=set1&size=150x150`,
      }));
      setInitialRobots(robotList);
      setRobots(robotList);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchInitialRobots();
  }, [fetchInitialRobots]);

  const changeRobotsCollection = useCallback(() => {
    const shuffledRobots = initialRobots.sort(() => 0.5 - Math.random());
    setRobots(shuffledRobots);
  }, [initialRobots]);

  useEffect(() => {
    const intervalId = setInterval(changeRobotsCollection, 18000);
    return () => clearInterval(intervalId);
  }, [changeRobotsCollection]);

  const handleCardClick = useCallback((robot) => {
    setModalContent(robot);
    setModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  useEffect(() => {
    const filteredRobots = initialRobots.filter((robot) =>
      robot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRobots(filteredRobots);
  }, [searchTerm, initialRobots]);
  
  const renderRobots = useCallback(() => {
    return robots.map((robot) => (
      <Card className='card'
        key={robot.id}
        cover={
          <img alt={robot.name} src={robot.image} style={{ transition: 'transform 0.3s' }} />
        }
        onClick={() => handleCardClick(robot)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Meta title={robot.name} description={robot.description} />
      </Card>
    ));
  }, [robots, handleCardClick]);

return (
  <div className='contenair' >
    
    <Input
      placeholder="Rechercher par nom"
      onSearch={handleSearch}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      allowClear
    
    />
    
    <div className='cards__contenair'>
      {robots.length > 0 ? (
        renderRobots()
      ) : (
        <div>Aucun robot trouvé.</div>
      )}
    </div>

    <Modal
      title={modalContent.name}
      visible={modalVisible}
      onCancel={handleCancel}
      footer={null}
    >    
      <img src={modalContent.image} alt={modalContent.name} />
      <p>{modalContent.description}</p>
    </Modal>
  </div>
);
};

export default Robotlist;