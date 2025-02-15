import { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Goal } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import './Dashboard.css';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => { 
  const [user, setUser] = useState<any>(null);
  const [totalDonations, setTotalDonations] = useState(0);
  
  useEffect(() => {
    fetchUserData();
    fetchDonations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/donations/total', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setTotalDonations(data.total);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const copyDonationLink = () => {
    const link = `${window.location.origin}/donate/${user?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Donation link copied!');
  };

  const shareOnWhatsApp = () => {
    const link = `${window.location.origin}/donate/${user?.referralCode}`;
    const message = encodeURIComponent(
      `Hi, I am raising funds for NayePankh Foundation. Please support me by donating through this link ${link} and make a difference!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const goalRef = useRef(null);
  const isInView = useInView(goalRef, { once: true });
  const [progress, setProgress] = useState(0);
  const [startCountUp, setStartCountUp] = useState(false);

  useEffect(() => {
    if (isInView) {
      setStartCountUp(true);

      const startTime = performance.now();
      const animationDuration = 3000;

      const step = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progressValue = Math.min(
          (elapsedTime / animationDuration) * 100,
          100
        );
        setProgress(progressValue);

        if (elapsedTime < animationDuration) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  }, [isInView]);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <motion.div className="header-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className="header-overlay">
            <Sidebar/>
            <div className="nav">
              <div><Link to="/dashboard">Home</Link></div>
              <div><Link to="/transactions">Transactions</Link></div>
              <div><button onClick={handleLogout}>Logout</button></div>
            </div>
            <img className="logo" src="/public/logo.png" alt="Logo"/>
            <h1 className="header-quote">"Every child deserves a chance to dream, grow, and succeed."</h1>
          </div>
        </motion.div>
        <h1 className="welcome-text">Welcome, {user?.name}!</h1>
        <motion.div className="content-section" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
          
          <div ref={goalRef} className="goal-card">
            <div className="goal-circle" style={{ width: 250, height: 250 }}>
              <CircularProgressbarWithChildren
                value={progress}
                circleRatio={1}
                styles={buildStyles({
                  pathTransitionDuration: 3,
                  rotation: 1,
                  pathColor: `#4CAF50`,
                  trailColor: "#d6d6d6",
                  strokeLinecap: "round", 
                })}
              >
                <div className="goal-icon">
                  <Goal className="icon" />
                  <h2>Goal Achieved</h2>
                </div>
                {startCountUp && (
                  <CountUp
                    start={0}
                    end={totalDonations}
                    duration={2}
                    prefix="₹"
                    separator=","
                    className="text-4xl font-bold text-blue-500"
                  />
                )}
              </CircularProgressbarWithChildren>
            </div>
          </div>

          <div className="referral-card">
            <h2>Your Referral Code</h2>
            <div className="referral-code">{user?.referralCode}</div>
            <div className="button-group">
              <button className="copy-btn" onClick={copyDonationLink}>
                <Copy className="icon" /> Copy Donation Link
              </button>
              <button className="share-btn" onClick={shareOnWhatsApp}>
                <Share2 className="icon" /> Share on WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
