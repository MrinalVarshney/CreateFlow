
import React from 'react';
import './NotFoundPage.css'; // Assuming you have a separate CSS file

const NotFoundPage = () => {
    return (
        <>
        
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center" style={{textAlign:"center"}}>404</h1>
              </div>
              <div className="content_box_404" style={{textAlign:"center"}}>
                <h3 >Looks Like You're Lost</h3>
                <p style={{margin:"10px"}}>The page you are looking for is not available</p>
                <a href="../dashBoard" className="home-link" >Go to Home</a> {/* Replace '/' with the actual home page URL */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
    );
  };

export default NotFoundPage;

