type GetInTouchProps = {
  variant?: 'default' | 'compact';
};

export default function GetInTouch({ variant = 'default' }: GetInTouchProps) {
  return (
    <section className={`bg-dark text-white ${variant === 'default' ? 'py-16' : 'py-8'}`}>
      <div className="container">
        <div className="text-center" style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%' }}>
          <h2 className={`${variant === 'default' ? 'h1' : 'h2'} mb-4 font-electric`}>
            Get In Touch
          </h2>
          <p className={`${variant === 'default' ? 'fs-5' : 'fs-6'} mb-6 text-gray-300`}>
            Interested in working with Claim Records? We're always looking for new talent and collaborations.
          </p>
          
          <div className="d-flex justify-content-center gap-4 mb-6">
            <a 
              href="mailto:info@claimrecordslabel.com" 
              className="text-white text-3xl hover:text-primary transition-colors"
              aria-label="Email"
            >
              <i className="bi bi-envelope"></i>
            </a>
            <a 
              href="https://www.instagram.com/claimrecords" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a 
              href="https://www.facebook.com/claimrecords" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a 
              href="https://www.twitter.com/claimrecords" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>
          
          <p className="text-gray-400">
            <a 
              href="mailto:info@claimrecordslabel.com" 
              className="text-white hover:text-primary transition-colors"
            >
              info@claimrecordslabel.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
