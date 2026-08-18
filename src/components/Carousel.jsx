import { useCallback, useEffect, useState } from "react";

const Carousel = ({
  items = [],
  renderItem,
  slidesPerView = 1,
  desktopSlidesPerView = slidesPerView,
  autoPlay = false,
  interval = 4500,
  initialIndex = 0,
  showIndicators = false,
  indicatorsInside = false,
  navigationInside = false,
  className = "",
  viewportClassName = "",
  trackClassName = "",
  slideClassName = "",
  ariaLabel = "Carousel",
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
  onIndexChange,
}) => {
  const [index, setIndex] = useState(initialIndex);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 768px)").matches
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = (event) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const requestedSlides = isDesktop ? desktopSlidesPerView : slidesPerView;
  const visibleSlides = Math.max(1, Math.min(requestedSlides, items.length || 1));
  const maxIndex = Math.max(0, items.length - visibleSlides);
  const canNavigate = maxIndex > 0;

  useEffect(() => {
    setIndex(Math.min(Math.max(0, initialIndex), maxIndex));
  }, [initialIndex, maxIndex]);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const goPrevious = useCallback(() => {
    setIndex((current) => (current <= 0 ? maxIndex : current - 1));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    setIndex((current) => (current >= maxIndex ? 0 : current + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!autoPlay || isPaused || !canNavigate) return undefined;

    const timer = window.setTimeout(goNext, interval);
    return () => window.clearTimeout(timer);
  }, [autoPlay, canNavigate, goNext, index, interval, isPaused]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resume();
      }}
    >
      <div className={`overflow-hidden ${viewportClassName}`}>
        <div
          className={`carousel-track flex transition-transform duration-500 ease-out ${trackClassName}`}
          style={{
            transform: `translateX(-${index * (100 / visibleSlides)}%)`,
          }}
        >
          {items.map((item, itemIndex) => {
            const isHidden =
              itemIndex < index || itemIndex >= index + visibleSlides;

            return (
              <div
                key={item.id || item.src || item.title || itemIndex}
                className={`min-w-0 shrink-0 ${slideClassName}`}
                style={{ flexBasis: `${100 / visibleSlides}%` }}
                aria-hidden={isHidden}
                inert={isHidden}
              >
                {renderItem(item, itemIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {canNavigate && (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className={`carousel-control absolute top-1/2 z-20 -translate-y-1/2 ${
              navigationInside ? "left-3" : "left-2 md:-left-5"
            }`}
            aria-label={previousLabel}
          >
            <i className="bx bx-chevron-left"></i>
          </button>
          <button
            type="button"
            onClick={goNext}
            className={`carousel-control absolute top-1/2 z-20 -translate-y-1/2 ${
              navigationInside ? "right-3" : "right-2 md:-right-5"
            }`}
            aria-label={nextLabel}
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </>
      )}

      {showIndicators && canNavigate && (
        <div
          className={`carousel-indicators flex items-center justify-center gap-2 ${
            indicatorsInside
              ? "absolute bottom-3 left-1/2 z-20 -translate-x-1/2"
              : "mt-5"
          }`}
        >
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className={`carousel-indicator ${
                dotIndex === index ? "is-active" : ""
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
