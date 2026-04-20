import React from 'react';

// BÀI 4 - LAB 2: Component nhận props title, content và hiển thị children
const Card = ({ title, content, gradient, shadowColor, children }) => {
  return (
    <div 
      className="card border-0 bg-white h-100 position-relative overflow-hidden"
      style={{
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 20px 40px ${shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
      }}
    >
     
      <div className="position-absolute top-0 end-0 rounded-circle" style={{ width: '120px', height: '120px', background: gradient, opacity: '0.08', transform: 'translate(30%, -30%)', filter: 'blur(20px)' }}></div>
      
      <div className="card-body p-4 d-flex flex-column justify-content-center position-relative z-1">
        
        {/* SỬ DỤNG PROPS.CHILDREN (chứa icon và badge % tăng giảm) */}
        {children && (
          <div className="d-flex align-items-center justify-content-between mb-4">
            {children}
          </div>
        )}

        {/* HIỂN THỊ PROPS.CONTENT */}
        <h3 className="fw-bolder mb-1 text-dark" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
          {content}
        </h3>
        
        {/* HIỂN THỊ PROPS.TITLE */}
        <p className="text-muted small fw-semibold mb-0 text-uppercase" style={{ letterSpacing: '0.5px' }}>
          {title}
        </p>

      </div>
    </div>
  );
};

export default Card;