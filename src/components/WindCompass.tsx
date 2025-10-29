import { Card } from "@/components/ui/card";
import { PanelContainer } from "@/components/ui/panel-container";
import { cn } from "@/lib/utils"; // added for merging classes

interface WindCompassProps {
  direction: number;
  minorTickAngle: number;
  majorTickAngle: number;
  speed: number;
  jumpRun?: number | null;
  className?: string;
  variant?: "default" | "panel";
}

function directionLabel(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}

export const WindCompass = ({
  direction,
  speed,
  minorTickAngle = 5,
  majorTickAngle = 30,
  jumpRun,
  className = "",
  variant = "default",
}: Readonly<WindCompassProps>) => {
  const effectiveVariant = variant;

  const compass = (
    <div
      className={cn(
        // Responsive sizing: smaller on mobile, larger on desktop/TV
        "relative w-[200px] h-[200px] xs:w-[240px] xs:h-[240px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] xl:w-[480px] xl:h-[480px] 2xl:w-[560px] 2xl:h-[560px] 3xl:w-[720px] 3xl:h-[720px] 4xl:w-[900px] 4xl:h-[900px] 5xl:w-[1200px] 5xl:h-[1200px]",
        "transition-all duration-300"
      )}
      aria-label="Wind direction compass"
    >
      {/* Outer bezel ring - brushed metal with realistic lighting */}
      <div
        className="absolute inset-0 rounded-full border-[4px] sm:border-[5px] lg:border-[6px] 3xl:border-[8px] 4xl:border-[10px] 5xl:border-[12px] border-[#8b4513]"
        style={{
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.4)",
          background:
            "conic-gradient(from 0deg, #6b4423, #8b5a3c, #7a4a2e, #6b4423, #8b5a3c, #7a4a2e, #6b4423), radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), transparent 50%)",
        }}
      />

      {/* Middle brass ring - decorative bezel detail */}
      <div
        className="absolute inset-[6px] xs:inset-[7px] sm:inset-[8px] md:inset-[10px] lg:inset-[12px] xl:inset-[14px] 2xl:inset-[16px] 3xl:inset-[20px] 4xl:inset-[25px] 5xl:inset-[33px] rounded-full border-[2px] sm:border-[2.5px] lg:border-[3px] 3xl:border-[4px] 4xl:border-[5px] 5xl:border-[6px]"
        style={{
          borderColor: "#cd853f",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.3)",
          background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%)",
        }}
      />

      {/* Inner compass circle - glass-covered dial face */}
      <div
        className="absolute inset-2 sm:inset-2.5 lg:inset-3 3xl:inset-4 4xl:inset-5 5xl:inset-6 rounded-full border-[4px] sm:border-[5px] lg:border-[6px] 3xl:border-[8px] 4xl:border-[10px] 5xl:border-[12px]"
        style={{
          borderColor: "#4a0e0e",
          boxShadow:
            "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 -2px 8px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.2)",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.03), transparent 70%), linear-gradient(145deg, rgba(250,250,250,0.95) 0%, rgba(245,245,245,0.92) 50%, rgba(235,235,235,0.9) 100%)",
        }}
      >
        {/* Glass reflection effect overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 800px 400px at 30% 20%, rgba(255,255,255,0.15), transparent 40%)",
          }}
        />
        {/* Degree markings - positioned using Tailwind for consistency */}
        {Array.from({ length: 360 / minorTickAngle }).map((_, i) => {
          const angle = i * minorTickAngle;
          const isMajor = angle % majorTickAngle === 0;
          const displayAngle = (angle + 180) % 360;

          return (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            >
              {/* Tick mark */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bg-muted-foreground rounded-sm
                  ${
                    isMajor
                      ? "w-[3px] h-[16px] xs:w-[3px] xs:h-[19px] sm:w-[3.5px] sm:h-[22px] md:w-[4px] md:h-[27px] lg:w-[4.5px] lg:h-[32px] xl:w-[5px] xl:h-[38px] 2xl:w-[5.5px] 2xl:h-[45px] 3xl:w-[7px] 3xl:h-[58px] 4xl:w-[8.5px] 4xl:h-[72px] 5xl:w-[11px] 5xl:h-[96px] opacity-65 top-[76px] xs:top-[93px] sm:top-[108px] md:top-[133px] lg:top-[156px] xl:top-[190px] 2xl:top-[223px] 3xl:top-[286px] 4xl:top-[358px] 5xl:top-[480px]"
                      : "w-[1.5px] h-[8px] xs:w-[1.5px] xs:h-[10px] sm:w-[2px] sm:h-[11px] md:w-[2px] md:h-[13px] lg:w-[2.5px] lg:h-[16px] xl:w-[2.5px] xl:h-[19px] 2xl:w-[3px] 2xl:h-[22px] 3xl:w-[3.5px] 3xl:h-[29px] 4xl:w-[4.5px] 4xl:h-[36px] 5xl:w-[5.5px] 5xl:h-[48px] opacity-35 top-[84px] xs:top-[102px] sm:top-[119px] md:top-[147px] lg:top-[172px] xl:top-[209px] 2xl:top-[246px] 3xl:top-[315px] 4xl:top-[394px] 5xl:top-[528px]"
                  }`}
              />

              {/* Degree numbers - only on major marks */}
              {isMajor && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 text-center font-bold text-muted-foreground
                    text-[7px] xs:text-[8px] sm:text-[9px] md:text-[11px] lg:text-[13px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[23px] 4xl:text-[29px] 5xl:text-[38px]
                    top-[62px] xs:top-[76px] sm:top-[88px] md:top-[109px] lg:top-[128px] xl:top-[156px] 2xl:top-[183px] 3xl:top-[235px] 4xl:top-[294px] 5xl:top-[394px]"
                  style={{
                    transform: `translateX(-50%) rotate(-${angle}deg)`,
                  }}
                >
                  {displayAngle == 0 ? 360 : displayAngle}°
                </div>
              )}
            </div>
          );
        })}

        {/* Intercardinal directions (positioned close to inner dial edge, inside and non-overlapping with markers) - responsive text */}
        <div className="absolute top-[35px] left-[35px] xs:top-[42px] xs:left-[42px] sm:top-[49px] sm:left-[49px] md:top-[60px] md:left-[60px] lg:top-[70px] lg:left-[70px] xl:top-[84px] xl:left-[84px] 2xl:top-[98px] 2xl:left-[98px] 3xl:top-[126px] 3xl:left-[126px] 4xl:top-[158px] 4xl:left-[158px] 5xl:top-[210px] 5xl:left-[210px] text-xs sm:text-sm lg:text-base 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-medium text-muted-foreground/70">
          NW
        </div>
        <div className="absolute top-[35px] right-[35px] xs:top-[42px] xs:right-[42px] sm:top-[49px] sm:right-[49px] md:top-[60px] md:right-[60px] lg:top-[70px] lg:right-[70px] xl:top-[84px] xl:right-[84px] 2xl:top-[98px] 2xl:right-[98px] 3xl:top-[126px] 3xl:right-[126px] 4xl:top-[158px] 4xl:right-[158px] 5xl:top-[210px] 5xl:right-[210px] text-xs sm:text-sm lg:text-base 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-medium text-muted-foreground/70">
          NE
        </div>
        <div className="absolute bottom-[35px] left-[35px] xs:bottom-[42px] xs:left-[42px] sm:bottom-[49px] sm:left-[49px] md:bottom-[60px] md:left-[60px] lg:bottom-[70px] lg:left-[70px] xl:bottom-[84px] xl:left-[84px] 2xl:bottom-[98px] 2xl:left-[98px] 3xl:bottom-[126px] 3xl:left-[126px] 4xl:bottom-[158px] 4xl:left-[158px] 5xl:bottom-[210px] 5xl:left-[210px] text-xs sm:text-sm lg:text-base 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-medium text-muted-foreground/70">
          SW
        </div>
        <div className="absolute bottom-[35px] right-[35px] xs:bottom-[42px] xs:right-[42px] sm:bottom-[49px] sm:right-[49px] md:bottom-[60px] md:right-[60px] lg:bottom-[70px] lg:right-[70px] xl:bottom-[84px] xl:right-[84px] 2xl:bottom-[98px] 2xl:right-[98px] 3xl:bottom-[126px] 3xl:right-[126px] 4xl:bottom-[158px] 4xl:right-[158px] 5xl:bottom-[210px] 5xl:right-[210px] text-xs sm:text-sm lg:text-base 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-medium text-muted-foreground/70">
          SE
        </div>
      </div>

      {/* External cardinal direction labels (map style) - increased spacing */}
      <div className="absolute inset-0 pointer-events-none select-none font-extrabold tracking-wider text-foreground/90">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] md:-translate-y-[130%] xl:-translate-y-[140%] 3xl:-translate-y-[150%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl drop-shadow-sm">
          N
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120%] md:translate-y-[130%] xl:translate-y-[140%] 3xl:translate-y-[150%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground drop-shadow-sm">
          S
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[120%] md:-translate-x-[130%] xl:-translate-x-[140%] 3xl:-translate-x-[150%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground drop-shadow-sm">
          W
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[120%] md:translate-x-[130%] xl:translate-x-[140%] 3xl:translate-x-[150%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground drop-shadow-sm">
          E
        </div>
      </div>

      {/* Wind needle - realistic compass needle design */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
        style={{ transform: `rotate(${direction}deg)` }}
        aria-hidden
      >
        {/* Needle body - elongated diamond shape with metallic look */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] xs:w-[7px] sm:w-[8px] md:w-[10px] lg:w-[12px] xl:w-[14px] 2xl:w-[16px] 3xl:w-[20px] 4xl:w-[25px] 5xl:w-[33px] h-[152px] xs:h-[186px] sm:h-[216px] md:h-[266px] lg:h-[312px] xl:h-[380px] 2xl:h-[446px] 3xl:h-[572px] 4xl:h-[716px] 5xl:h-[960px] rounded-full opacity-20 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/30"
          style={{
            boxShadow: "inset 2px 0 4px rgba(255,255,255,0.3), inset -2px 0 4px rgba(0,0,0,0.3)",
          }}
        />

        {/* North pointer (red) - sharp needle tip with metallic gradient */}
        <div
          className="absolute top-[calc(50%-76px)] xs:top-[calc(50%-93px)] sm:top-[calc(50%-108px)] md:top-[calc(50%-133px)] lg:top-[calc(50%-156px)] xl:top-[calc(50%-190px)] 2xl:top-[calc(50%-223px)] 3xl:top-[calc(50%-286px)] 4xl:top-[calc(50%-358px)] 5xl:top-[calc(50%-480px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] xs:border-l-[5px] sm:border-l-[6px] md:border-l-[7px] lg:border-l-[8px] xl:border-l-[10px] 2xl:border-l-[11px] 3xl:border-l-[14px] 4xl:border-l-[18px] 5xl:border-l-[23px] border-r-[4px] xs:border-r-[5px] sm:border-r-[6px] md:border-r-[7px] lg:border-r-[8px] xl:border-r-[10px] 2xl:border-r-[11px] 3xl:border-r-[14px] 4xl:border-r-[18px] 5xl:border-r-[23px] border-b-[76px] xs:border-b-[93px] sm:border-b-[108px] md:border-b-[133px] lg:border-b-[156px] xl:border-b-[190px] 2xl:border-b-[223px] 3xl:border-b-[286px] 4xl:border-b-[358px] 5xl:border-b-[480px] border-l-transparent border-r-transparent border-b-[#dc2626]"
          style={{
            filter:
              "drop-shadow(0 2px 4px rgba(220, 38, 38, 0.5)) drop-shadow(0 0 8px rgba(220, 38, 38, 0.3))",
            background: "linear-gradient(to bottom, #ef4444, #dc2626, #991b1b)",
          }}
        />

        {/* North pointer highlight for metallic effect */}
        <div className="absolute top-[calc(50%-70px)] xs:top-[calc(50%-86px)] sm:top-[calc(50%-100px)] md:top-[calc(50%-123px)] lg:top-[calc(50%-144px)] xl:top-[calc(50%-175px)] 2xl:top-[calc(50%-206px)] 3xl:top-[calc(50%-264px)] 4xl:top-[calc(50%-330px)] 5xl:top-[calc(50%-442px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] xs:border-l-[2.5px] sm:border-l-[3px] md:border-l-[3.5px] lg:border-l-[4px] xl:border-l-[5px] 2xl:border-l-[5.5px] 3xl:border-l-[7px] 4xl:border-l-[9px] 5xl:border-l-[11.5px] border-r-[2px] xs:border-r-[2.5px] sm:border-r-[3px] md:border-r-[3.5px] lg:border-r-[4px] xl:border-r-[5px] 2xl:border-r-[5.5px] 3xl:border-r-[7px] 4xl:border-r-[9px] 5xl:border-r-[11.5px] border-b-[30px] xs:border-b-[37px] sm:border-b-[43px] md:border-b-[53px] lg:border-b-[62px] xl:border-b-[76px] 2xl:border-b-[89px] 3xl:border-b-[114px] 4xl:border-b-[143px] 5xl:border-b-[192px] border-l-transparent border-r-transparent border-b-red-400/40" />

        {/* South pointer (silver/metallic) - realistic tail */}
        <div
          className="absolute bottom-[calc(50%-76px)] xs:bottom-[calc(50%-93px)] sm:bottom-[calc(50%-108px)] md:bottom-[calc(50%-133px)] lg:bottom-[calc(50%-156px)] xl:bottom-[calc(50%-190px)] 2xl:bottom-[calc(50%-223px)] 3xl:bottom-[calc(50%-286px)] 4xl:bottom-[calc(50%-358px)] 5xl:bottom-[calc(50%-480px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] xs:border-l-[5px] sm:border-l-[6px] md:border-l-[7px] lg:border-l-[8px] xl:border-l-[10px] 2xl:border-l-[11px] 3xl:border-l-[14px] 4xl:border-l-[18px] 5xl:border-l-[23px] border-r-[4px] xs:border-r-[5px] sm:border-r-[6px] md:border-r-[7px] lg:border-r-[8px] xl:border-r-[10px] 2xl:border-r-[11px] 3xl:border-r-[14px] 4xl:border-r-[18px] 5xl:border-r-[23px] border-t-[76px] xs:border-t-[93px] sm:border-t-[108px] md:border-t-[133px] lg:border-t-[156px] xl:border-t-[190px] 2xl:border-t-[223px] 3xl:border-t-[286px] 4xl:border-t-[358px] 5xl:border-t-[480px] border-l-transparent border-r-transparent border-t-[#71717a]"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
            background: "linear-gradient(to top, #a1a1aa, #71717a, #52525b)",
          }}
        />

        {/* South pointer highlight for metallic effect */}
        <div className="absolute bottom-[calc(50%-70px)] xs:bottom-[calc(50%-86px)] sm:bottom-[calc(50%-100px)] md:bottom-[calc(50%-123px)] lg:bottom-[calc(50%-144px)] xl:bottom-[calc(50%-175px)] 2xl:bottom-[calc(50%-206px)] 3xl:bottom-[calc(50%-264px)] 4xl:bottom-[calc(50%-330px)] 5xl:bottom-[calc(50%-442px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] xs:border-l-[2.5px] sm:border-l-[3px] md:border-l-[3.5px] lg:border-l-[4px] xl:border-l-[5px] 2xl:border-l-[5.5px] 3xl:border-l-[7px] 4xl:border-l-[9px] 5xl:border-l-[11.5px] border-r-[2px] xs:border-r-[2.5px] sm:border-r-[3px] md:border-r-[3.5px] lg:border-r-[4px] xl:border-r-[5px] 2xl:border-r-[5.5px] 3xl:border-r-[7px] 4xl:border-r-[9px] 5xl:border-r-[11.5px] border-t-[30px] xs:border-t-[37px] sm:border-t-[43px] md:border-t-[53px] lg:border-t-[62px] xl:border-t-[76px] 2xl:border-t-[89px] 3xl:border-t-[114px] 4xl:border-t-[143px] 5xl:border-t-[192px] border-l-transparent border-r-transparent border-t-zinc-400/60" />
      </div>

      {/* Center pivot - responsive sizing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 4xl:w-16 4xl:h-16 5xl:w-20 5xl:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border-[2px] sm:border-[3px] lg:border-[4px] 3xl:border-[5px] 4xl:border-[6px] 5xl:border-[8px] border-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 3xl:w-6 3xl:h-6 4xl:w-8 4xl:h-8 5xl:w-10 5xl:h-10 rounded-full bg-background/80" />
    </div>
  );

  const infoPanel = (
    <div
      className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20 3xl:mt-24 4xl:mt-32 5xl:mt-40"
      aria-live="polite"
    >
      <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] 5xl:text-[13rem] font-bold text-foreground mb-2 sm:mb-3 3xl:mb-4 4xl:mb-6 5xl:mb-8">
        <span className={"text-transparent"}>°</span>
        {direction}°<span className="text-accent"> {directionLabel(direction)}</span>
      </div>

      {jumpRun !== null && jumpRun !== undefined && (
        <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl font-semibold text-pretty mb-2 sm:mb-3 3xl:mb-4 4xl:mb-6 5xl:mb-8">
          <span className="text-muted-foreground">Jump Run:</span> {jumpRun}{" "}
          <span className="text-accent">{directionLabel(jumpRun)}</span>
        </div>
      )}

      <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl 5xl:text-9xl text-muted-foreground">
        {speed.toFixed(0)}
        <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl">
          {" "}
          mph
        </span>
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 3xl:px-12 3xl:py-16 4xl:px-16 4xl:py-20 5xl:px-20 5xl:py-24">
      {compass}
      {infoPanel}
    </div>
  );

  if (effectiveVariant === "panel") {
    return (
      <PanelContainer center noPadding className={className}>
        <div className="h-full w-full flex justify-center">{content}</div>
      </PanelContainer>
    );
  }

  // default
  return <Card className={cn("h-full w-full flex justify-center", className)}>{content}</Card>;
};
