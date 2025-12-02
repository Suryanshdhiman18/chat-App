# # Use a valid OpenJDK base image
# FROM eclipse-temurin:17-jdk
#
# # Set working directory
# WORKDIR /app
#
# # Copy Maven wrapper and project files
# COPY mvnw .
# COPY .mvn .mvn
# COPY pom.xml .
# COPY src ./src
#
# # Make mvnw executable
# RUN chmod +x mvnw
#
# # Build the project
# RUN ./mvnw clean package -DskipTests
#
# # Expose port
# # EXPOSE 8080
#
# # Run the Spring Boot app
# CMD ["java", "-jar", "target/chatApp-0.0.1-SNAPSHOT.jar"]


FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/chatApp-0.0.1-SNAPSHOT.jar"]

