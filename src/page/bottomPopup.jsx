import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

// Reusable BottomPopup component
const BottomPopup = forwardRef(
  ({ title, children, onClose, bar = true, zIndex = 100 }, ref) => {
    const [isVisible, setIsVisible] = useState(false); // Visibility state for popup
    const [iscanScroll, setIscanScroll] = useState(true); // Visibility state for popup
    const [startY, setStartY] = useState(null); // Track touch start position
    const [bottomPos, setBottomPos] = useState(0); // Bottom position for the popup
    const [velocity, setVelocity] = useState(0); // Scroll velocity
    const isTouchingRef = useRef(false); // Touch state
    const bodyRef = useRef(false);
    const boxRef = useRef(false);
    let animationFrame;

    useImperativeHandle(ref, () => ({
      closePopup: handleClose,
      canScroll: canScroll,
    }));
    const handleClose = () => {
      setIsVisible(true); // Start fade-out effect
      setTimeout(() => {
        onClose();
      }, 200);
    };

    // Handle touch start (for drag)
    const handleTouchStart = (e) => {
      setStartY(e.touches[0].clientY);
      isTouchingRef.current = true; // Mark that touch is ongoing
      cancelAnimationFrame(animationFrame); // Cancel any ongoing animation frame
    };

    // Handle touch move (for drag)
    const handleTouchMove = (e) => {
      if (startY !== null) {
        const touchY = e.touches[0].clientY;
        const diffY = startY - touchY; // Difference in touch position
        let newBottomPos = bottomPos + diffY; // Update bottom position
        if (newBottomPos > 0) newBottomPos = 0; // Limit the scroll to not go above the screen
        setBottomPos(newBottomPos);
        setStartY(touchY); // Update start position for continuous dragging

        // Calculate velocity based on touch movement
        setVelocity(diffY);
      }
    };

    // Handle touch end (after drag)
    const handleTouchEnd = () => {
      setStartY(null);
      isTouchingRef.current = false;

      const stopScroll = () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame); // Stop ongoing animation
        }
      };
      const continueScroll = () => {
        if (!isTouchingRef.current && Math.abs(velocity) > 0.1) {
          setVelocity((prevVelocity) => {
            const newVelocity = prevVelocity * 0.95; // Slow down the velocity
            setBottomPos((prevBottomPos) => {
              let newBottomPos = prevBottomPos + newVelocity;
              if (newBottomPos > 0) newBottomPos = 0; // Don't exceed 0 position
              if (Math.abs(newVelocity) <= 0.1) {
                stopScroll(); // Stop animation if velocity is small
              }

              const bottomBox = boxRef.current;
              const bottomBoxHeight = bottomBox?.offsetHeight || 0;
              const computedStyle = window.getComputedStyle(bottomBox);
              const bottomCssValue = parseFloat(computedStyle.bottom) || 0;
              console.log(bottomBoxHeight / 3, bottomCssValue * -1);
              const increment = 4; // Scroll increment
              if (bottomBoxHeight - bottomCssValue * -1 <= 200) {
                handleClose();
              } else if (bottomCssValue * -1 < bottomBoxHeight * 0.3) {
                newBottomPos = Math.min(newBottomPos + increment, 0);
              } else {
                newBottomPos = Math.max(newBottomPos - increment, -1000);
              }
              return newBottomPos;
            });
            return newVelocity;
          });
          animationFrame = requestAnimationFrame(continueScroll);
        }
      };
      animationFrame = requestAnimationFrame(continueScroll);
    };

    const canScroll = (e) => {
      setIscanScroll(e);
    };
    const handleTouchStart2 = (e) => {
      const scollDiv = bodyRef.current;
      if (scollDiv.scrollTop == 0 && iscanScroll) {
        setStartY(e.touches[0].clientY);
        isTouchingRef.current = true; // Mark that touch is ongoing
        cancelAnimationFrame(animationFrame); // Cancel any ongoing animation frame
      }
    };

    // Handle touch move (for drag)
    const handleTouchMove2 = (e) => {
      if (startY !== null && iscanScroll) {
        const touchY = e.touches[0].clientY;
        const diffY = startY - touchY; // Difference in touch position
        let newBottomPos = bottomPos + diffY; // Update bottom position
        if (newBottomPos > 0) newBottomPos = 0; // Limit the scroll to not go above the screen
        setBottomPos(newBottomPos);
        setStartY(touchY); // Update start position for continuous dragging

        // Calculate velocity based on touch movement
        setVelocity(diffY);
      }
    };
    const handleTouchEnd2 = () => {
      setStartY(null);
      setIscanScroll(true);
      isTouchingRef.current = false;
      const stopScroll = () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame); // Stop ongoing animation
        }
      };
      const continueScroll = () => {
        const bottomBox = bodyRef.current;
        if (!isTouchingRef.current && Math.abs(velocity) > 0.1) {
          setVelocity((prevVelocity) => {
            const newVelocity = prevVelocity * 0.95; // Slow down the velocity
            setBottomPos((prevBottomPos) => {
              let newBottomPos = prevBottomPos + newVelocity;
              if (newBottomPos > 0) newBottomPos = 0; // Don't exceed 0 position
              if (Math.abs(newVelocity) <= 0.1) {
                stopScroll(); // Stop animation if velocity is small
              }
              const bottomBoxHeight = bottomBox?.offsetHeight || 0;
              const computedStyle = boxRef.current.style;
              const bottomCssValue = parseFloat(computedStyle.bottom) || 0;
              console.log(bottomBoxHeight, bottomCssValue * -1);
              const increment = 4; // Scroll increment
              if (bottomBoxHeight - bottomCssValue * -1 <= 200) {
                handleClose();
              } else if (bottomCssValue * -1 < bottomBoxHeight * 0.3) {
                newBottomPos = Math.min(newBottomPos + increment, 0);
              } else {
                newBottomPos = Math.max(newBottomPos - increment, -1000);
              }
              return newBottomPos;
            });
            return newVelocity;
          });
          animationFrame = requestAnimationFrame(continueScroll);
        }
      };
      animationFrame = requestAnimationFrame(continueScroll);
    };
    return (
      <div className="bg-full" style={{ zIndex: zIndex }}>
        <div
          className={`detectOut ${isVisible ? "fade-out" : "fade-in"}`}
        ></div>
        <div
          ref={boxRef}
          className={`box-main-body ${isVisible ? "slideOut" : "slideIn"}`}
          style={{ bottom: `${bottomPos}px` }}
          onTouchStart={handleTouchStart2}
          onTouchMove={handleTouchMove2}
          onTouchEnd={handleTouchEnd2}
        >
          <div className="popup-top-container">
            {bar && (
              <div
                className="bar"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="bar-box"></div>
              </div>
            )}
            {title && <div className="title">{title}</div>}
          </div>
          <div className="popup-body-container" ref={bodyRef}>
            <div className="content-box">{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

export default BottomPopup;
