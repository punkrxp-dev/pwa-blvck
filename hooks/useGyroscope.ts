import { useState, useEffect } from 'react';

export interface GyroscopeOffset {
    x: number;
    y: number;
}

export const useGyroscope = (sensitivity: number = 1) => {
    const [offset, setOffset] = useState<GyroscopeOffset>({ x: 0, y: 0 });

    useEffect(() => {
        let isMounted = true;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!isMounted) return;

            const { beta, gamma } = event; // beta: -180 to 180 (tilt front-back), gamma: -90 to 90 (tilt left-right)

            if (beta !== null && gamma !== null) {
                // We normalize these values for a subtle effect
                // gamma (x-axis) and beta (y-axis)
                // Sensitivity 1 means approx max 10px offset for reasonable tilts
                const x = (gamma / 45) * 10 * sensitivity;
                const y = ((beta - 45) / 45) * 10 * sensitivity; // Adjusted for a natural 45deg holding angle

                setOffset({
                    x: Math.max(-20, Math.min(20, x)),
                    y: Math.max(-20, Math.min(20, y))
                });
            }
        };

        // iOS requires permission for DeviceOrientation
        const requestPermission = async () => {
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof (DeviceOrientationEvent as any).requestPermission === 'function'
            ) {
                try {
                    const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (error) {
                    console.error('Error requesting orientation permission:', error);
                }
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        requestPermission();

        return () => {
            isMounted = false;
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [sensitivity]);

    return offset;
};
