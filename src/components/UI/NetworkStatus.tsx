import React, { memo } from 'react';
import styles from './NetworkStatus.module.css';
import OnlineIcon from './icons/OnlineIcon';
import OfflineIcon from './icons/OfflineIcon';
import { formatCacheDateCustom } from '../../utils/cache';
import { useExchangeRates } from '../../hooks/useExchangeRates';

interface NetworkStatusProps {
  isOnline: boolean;
}

const NetworkStatusComponent: React.FC<NetworkStatusProps> = ({ 
  isOnline
}) => {
  const {lastUpdated} = useExchangeRates();

  return (
    <div className={styles.networkStatus}>
      <div 
        className={`${styles.statusIndicator} 
        ${isOnline ? styles.online : styles.offline}`}
      >
        {isOnline ? <OnlineIcon/> : <OfflineIcon/>}
        {isOnline ? 'Online' : 'Offline'}
        {!isOnline && (
          <span className={styles.offlineText}>
            Using cached rates from {formatCacheDateCustom(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  );
};

export const NetworkStatus = memo(NetworkStatusComponent);