import React, { useCallback, useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import TileMap from './components/TileMap';
import TileMapGrid from './components/TileMap/TileMapGrid';
import TileMapText from './components/TileMap/TileMapText';
import TileMapPercentBar from './components/TileMap/TileMapPercentBar';
import { ReactComponent as PlayerPauseSvg } from './assets/player-pause.svg';
import { ReactComponent as PlayerPlaySvg } from './assets/player-play.svg';
import { ReactComponent as NextSvg } from './assets/next.svg';
import TileMapTooltip from './components/TileMap/TileMapTooltip';
import styles from './App.module.scss';

const App = () => {
  const [data, setData] = useState([]);
  const [vaccinatedData, setVaccinatedData] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const maxTimeIndex = vaccinatedData[0]?.data.length - 1 || 0;
  const endPeriodDate = vaccinatedData[0]?.data[currentTimeIndex].end_period;

  const calculatePercentageOfVaccinated = useCallback((vaccinated, population) => (vaccinated / parseInt(population) * 100).toFixed(1), []);
  const updateData = useCallback((timeIndex, data, vaccinatedData) => {
    setData(data.map((mapItem, index) => {
      const vaccinatedItem = vaccinatedData[index].data[timeIndex];
      const vaccinated = vaccinatedItem.vaccinated;

      return {
        ...mapItem,
        end_period: vaccinatedItem.end_period,
        vaccinated: vaccinatedItem.vaccinated,
        percentageOfVaccinated: calculatePercentageOfVaccinated(vaccinated, mapItem.population)
      };
    }));
  }, [calculatePercentageOfVaccinated]);

  useEffect(() => {
    const getMapData = async () => {
      const [populationData, tileMap] = await Promise.all([
        d3.csv(process.env.PUBLIC_URL + '/russia-population-data.csv'),
        d3.csv(process.env.PUBLIC_URL + '/tile-map.csv')
      ]);

      const mapData = tileMap.map((tile) => ({ ...populationData.find(({ regionId }) => regionId === tile.regionId), ...tile }));

      const vaccinatedInfo = await Promise.all(mapData.map((mapItem) => axios.get('https://novayagazeta.ru/api/v1/dashboard/get/vaccination/stats', { params: { regionId: mapItem.regionId } })));

      const vaccinatedData = vaccinatedInfo.map((data) => data.data);

      setVaccinatedData(vaccinatedData);

      const currentTimeIndex = vaccinatedData[0].data.length - 1;

      setCurrentTimeIndex(currentTimeIndex);

      updateData(currentTimeIndex, mapData, vaccinatedData);
    };

    getMapData();
  }, [calculatePercentageOfVaccinated, updateData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isPlaying) return;

      const timeIndex = Math.max(Math.min(isNext ? currentTimeIndex + 1 : currentTimeIndex - 1, maxTimeIndex), 0);

      setCurrentTimeIndex(timeIndex);
      updateData(timeIndex, data, vaccinatedData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentTimeIndex, vaccinatedData, data, maxTimeIndex, isPlaying, isNext, updateData]);

  const handleChange = (e) => {
    const timeIndex = +e.target.value;

    setCurrentTimeIndex(timeIndex);
    updateData(timeIndex, data, vaccinatedData);
  };

  return (
    <>
      <div className={styles.tileMapWrapper}>
        <TileMap
          data={data}
          columns={19}
          rows={11}
          columnKey="column"
          rowKey="row"
          className={styles.tileMap}
        >
          <TileMapGrid stroke="#e3e4e5" />
          <TileMapPercentBar fill="#00ace5" dataKey="percentageOfVaccinated" />
          <TileMapText
            fill="#212226"
            textCreators={[(data) => data.regNameAbbr, (data) => `${data.percentageOfVaccinated}%`]}
          />
          <TileMapTooltip>
            {(data) =>
              <>
                <div>{data.end_period}</div>
                <div>{data.region}</div>
                <div>Вакцинированных: {data.vaccinated}</div>
                <div>Процент вакцинированных: {data.percentageOfVaccinated}%</div>
              </>
            }
          </TileMapTooltip>
        </TileMap>
      </div>
      <div className={styles.timeManager}>
        <input type="range" min="0" max={maxTimeIndex} step="1" value={currentTimeIndex} onChange={handleChange} />
        <div className={styles.player}>
          <NextSvg onClick={() => { setIsNext(false); setIsPlaying(true) }} className={styles.prevButton} />
          {isPlaying ?
            <PlayerPauseSvg onClick={() => setIsPlaying(false)} className={styles.playerButton} /> :
            <PlayerPlaySvg onClick={() => setIsPlaying(true)} className={styles.playerButton} />
          }
          <NextSvg onClick={() => { setIsNext(true); setIsPlaying(true) }} className={styles.nextButton} />
        </div>
        <div>{endPeriodDate}</div>
      </div>
    </>
  );
};

export default App;
